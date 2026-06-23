import numpy as np
import concurrent.futures

from DSPAnalyzer import Signal_Analyzer
from KDEstimator import KernelDensityEstimator


def foo(bar):
    print('hello {}'.format(bar))
    return bar, bar

class Features_Extraction(object):
    def __init__(self, data, data_grid):
        self.__data__ = data
        self.__datagrid__ = data_grid
        self.__rawprocessings__ = []
        self.__features__ = []

    @staticmethod
    def extract(data, signals):
        # Create two threads as follows
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
                futures = []
                extraction_results = []
                try:
                    #futures.append(executor.submit(Features_Extraction.extract_correlation_features, data, signals))
                    #futures.append(executor.submit(Features_Extraction.extract_fft_features, data, signals))
                    futures.append(executor.submit(Features_Extraction.extract_statistical_features_from_signals, data, signals))
                    #futures.append(executor.submit(Features_Extraction.extract_eigen_features, data, signals))
                except:
                    print('Error: unable to start threads')

                i = 0
                while futures.__len__() > 0:
                    f = futures[i]
                    try:
                        fresult = f.result(timeout=30)
                        if f.done() and f.cancelled():
                            futures.pop(i)
                        elif f.done() and not f.cancelled() and not f.running():
                            extraction_results.extend(fresult)
                            futures.pop(i)
                        elif f.done() and not f.running():
                            futures.pop(i)
                        if futures.__len__() != 0:
                            i = (i + 1) % futures.__len__()
                    except:
                        if f.done() and f.cancelled():
                            futures.pop(i)
                        elif f.done() and not f.cancelled() and not f.running():
                            extraction_results.extend(fresult)
                            futures.pop(i)
                        elif f.done() and not f.running():
                            futures.pop(i)
                        if futures.__len__() != 0:
                            i = (i + 1) % futures.__len__()
                return extraction_results
        except:
            print('Error: unable to extract features')
            return extraction_results

    @staticmethod
    def extract_fft_features(signal_data, signals, poly_deg=10):
        preprocessings = []
        features = []
        raw_features = []
        for data, signal in zip(signal_data, signals):
            try:
                data_grid = np.linspace(np.min(data), np.max(data), data.__len__())
                sp, freq, freq_sp, peaks, recostructed_data = Signal_Analyzer.frequency_peaks_analysis(data=data,
                                                                                                   data_grid=data_grid,
                                                                                                   signal=signal)
                poly_sp = Signal_Analyzer.polyfit(data=[sp.real], poly_deg=poly_deg)[0]
                poly_data = Signal_Analyzer.polyfit(data=[data], poly_deg=poly_deg)[0]
            except:
                print('Error: unable to compute fft for signal %s' %signal)
                continue

            fft_preprocessing = {'Signal': signal,
                                 'Data': data,
                                 'PolyData': poly_sp,
                                 'FFT': sp,
                                 'PolyFFT': poly_sp,
                                 'FFT_map': freq_sp,
                                 'FFT_peaks_map': np.max(peaks.values()),
                                 'FFT_npeaks': peaks.__len__(),
                                 'Method': 'Peaks Recostruction',
                                 'Recostructed_Signal': recostructed_data}
            preprocessing = {}
            preprocessing['Type'] = 'PP5'
            preprocessing['Sub_To'] = signal
            preprocessing['Data'] = fft_preprocessing
            preprocessings.append(preprocessing)
            info_fft_features = {'MaxFFTModulePeak': np.max(list(peaks.values())),
                                 'MaxFFTModulePeakFreq': freq[np.argmax(list(peaks.values()))],
                                 'MinFFTModulePeak': np.min(list(peaks.values())),
                                 'MinFFTModulePeakFreq': freq[np.argmin(list(peaks.values()))],
                                 'MaxFreq': np.max(freq),
                                 'MinFreq': np.min(freq),
                                 'FFTNPeaks': peaks.__len__(),
                                 }

            raw_fft_features = list(info_fft_features.values())
            raw_fft_features.extend(list(poly_data))
            raw_fft_features.extend(list(poly_sp))

            info_fft_features['Poly_Data'] = list(poly_data)
            info_fft_features['Poly_FFT'] = list(poly_sp)


            feature = {}
            feature['Type'] = 'FP5'
            feature['Sub_To'] = signal
            raw_feature = dict(feature)
            feature['Data'] = info_fft_features
            features.append(feature)
            raw_feature['Data'] = raw_fft_features
            raw_features.append(raw_feature)

        return preprocessings, features, raw_features



    @staticmethod
    def extract_eigen_features(data, signals):
        try:
            feature = {}
            raw_feature = {}
            sig_analysis = Signal_Analyzer.correlation(data=data, signals=signals)
            eigvals_kendall, eigvects_kendall = np.linalg.eig(sig_analysis.correlation_kendalls_matrix())
            eigvals_pearson, eigvects_pearson = np.linalg.eig(sig_analysis.correlation_pearsons_matrix())
            eigvals_spearman, eigvects_spearman = np.linalg.eig(sig_analysis.correlation_spearmans_matrix())
            eigen_preprocessing = {'EigenValues_kendall': eigvals_kendall,
                               'EigenVectors_kendall': eigvects_kendall,
                               'EigenValues_Pearson': eigvals_pearson,
                               'EigenVectors_Pearson': eigvects_pearson,
                               'EigenValues_Spearman': eigvals_spearman,
                               'EigenVectors_Spearman': eigvects_spearman,
                               'Binary_Covariance_Matrixes': sig_analysis.covariance_matrixes(),
                               'Spearman_Matrix': sig_analysis.correlation_spearmans_matrix(),
                               'Kendall_Matrix': sig_analysis.correlation_kendalls_matrix(),
                               'Pearson_Matrix': sig_analysis.correlation_pearsons_matrix()}
            preprocessing = {}
            preprocessing['Type'] = 'PP4'
            preprocessing['Sub_To'] = str([str(signals[i]) + ' ' for i in range(signals.__len__())])
            preprocessing['Data'] = eigen_preprocessing

            info_eigen_features = {'EigenValues_kendall': eigvals_kendall,
                               'EigenValues_Pearson': eigvals_pearson,
                               'EigenValues_Spearman': eigvals_spearman
                                 }
            raw_eigen_features = list(np.concatenate([np.array(eigvals_kendall).ravel(), np.array(eigvals_pearson).ravel(), np.array(eigvals_spearman).ravel()]))
            feature = {}
            feature['Type'] = 'FP4'
            feature['Sub_To'] = str([str(signals[i]) + ' ' for i in range(signals.__len__())])
            feature['Data'] = info_eigen_features

            raw_feature = dict(feature)
            raw_feature['Data'] = raw_eigen_features



            return [preprocessing], [feature], [raw_feature]
        except:
            return [{}], [{}], [{}]

    @staticmethod
    def extract_correlation_features(data, signals):
        preprocessings = []
        features = []
        raw_features = []
        sig_analysis = Signal_Analyzer.correlation(data=data, signals=signals)
        multiple_correlation_preprocessing = []
        multiple_correlation_features = []
        for icouple, spearman, pvalue, pearson, correlation_coeff, correlation in zip(sig_analysis.couples(), \
                                                                                      sig_analysis.spearmans(), \
                                                                                      sig_analysis.pvalues(), \
                                                                                      sig_analysis.pearsons(), \
                                                                                      sig_analysis.correlation_coeff(), \
                                                                                      sig_analysis.correlation()):
            signalAindex = icouple[0]
            signalBindex = icouple[1]
            single_correlation_preprocessing = {'SignaL1': signals[signalAindex],
                                                'Signal2': signals[signalBindex],
                                                signals[signalAindex]: data[signalAindex],
                                                signals[signalBindex]: data[signalBindex],
                                                'Mean' + signals[signalAindex]: np.mean(data[signalAindex]),
                                                'Stdv' + signals[signalAindex]: np.std(data[signalAindex]),
                                                'Mean' + signals[signalBindex]: np.mean(data[signalBindex]),
                                                'Stdv' + signals[signalBindex]: np.std(data[signalBindex]),
                                                'Spearman': spearman,
                                                'Pearson': pearson,
                                                'PValue': pvalue,
                                                'Correlation_Coefficients': correlation_coeff,
                                                'Correlation': correlation}
            single_preprocessing = {}
            single_preprocessing['Type'] = 'PP2'
            single_preprocessing['Sub_To'] = str(signals[signalAindex]) + ' ' + str(signals[signalBindex])
            single_preprocessing['Data'] = single_correlation_preprocessing
            preprocessings.append(single_preprocessing)

            info_corr_features = { 'Spearman': spearman,
                                   'Pearson': pearson,
                                   'PValue': pvalue,
                                   'Mean' + signals[signalAindex]: np.mean(data[signalAindex]),
                                   'Stdv' + signals[signalAindex]: np.std(data[signalAindex]),
                                   'Mean' + signals[signalBindex]: np.mean(data[signalBindex]),
                                   'Stdv' + signals[signalBindex]: np.std(data[signalBindex])
                                   }
            single_feature = {}
            single_feature['Type'] = 'FP2'
            single_feature['Sub_To'] = str(signals[signalAindex]) + ' ' + str(signals[signalBindex])
            single_raw_feature = dict(single_feature)
            single_raw_corr_features = list(np.reshape(correlation_coeff, correlation_coeff.__len__() * correlation_coeff.__len__()))
            single_raw_corr_features.extend(np.reshape(correlation, correlation.__len__() * correlation.__len__()))
            single_raw_corr_features.extend(info_corr_features.values())
            info_corr_features['Correlation_Coefficients'] = list(np.reshape(correlation_coeff, newshape=(1, -1)))
            info_corr_features['Correlation'] = list(np.reshape(correlation, newshape=(1, -1)))
            single_feature['Data'] = info_corr_features
            single_raw_feature['Data'] = single_raw_corr_features
            features.append(single_feature)
            raw_features.append(single_raw_feature)



        binary_tuple_index = sig_analysis.couples()
        binary_covariance_matrixes = sig_analysis.covariance_matrixes()
        spearman_matrix = sig_analysis.correlation_spearmans_matrix()
        kendall_matrix = sig_analysis.correlation_kendalls_matrix()
        pearson_matrix = sig_analysis.correlation_pearsons_matrix()
        correlation_preprocessing = {'Binary_Covariancion_Matrixes': binary_covariance_matrixes,
                                     'Binary_Tuple_Index': binary_tuple_index,
                                     'Single_Correlations': multiple_correlation_preprocessing,
                                     'Spearman_Matrix': spearman_matrix,
                                     'Kendall_Matrix': kendall_matrix,
                                     'Pearson_Matrix': pearson_matrix}
        preprocessing = {}
        preprocessing['Type'] = 'PP3'
        preprocessing['Sub_To'] = str([str(signals[i]) + ' ' for i in range(signals.__len__())])
        preprocessing['Data'] = correlation_preprocessing
        preprocessings.append(preprocessing)

        info_corr_features = {}
        raveled_matrix = np.matrix.ravel(np.array(spearman_matrix))
        one_filtered_matrix = raveled_matrix[[int(v) != 1 for v in raveled_matrix]]
        duplicate_filtered_matrix = set(one_filtered_matrix)
        raveled_matrix = list(duplicate_filtered_matrix)
        info_corr_features['SpearmanCorr'] = raveled_matrix

        raveled_matrix = np.matrix.ravel(np.array(kendall_matrix))
        one_filtered_matrix = raveled_matrix[[int(v) != 1 for v in raveled_matrix]]
        duplicate_filtered_matrix = set(one_filtered_matrix)
        raveled_matrix = list(duplicate_filtered_matrix)
        info_corr_features['KendallCorr'] = raveled_matrix

        raveled_matrix = np.matrix.ravel(np.array(pearson_matrix))
        one_filtered_matrix = raveled_matrix[[int(v) != 1 for v in raveled_matrix]]
        duplicate_filtered_matrix = set(one_filtered_matrix)
        raveled_matrix = list(duplicate_filtered_matrix)
        info_corr_features['PearsonCorr'] = raveled_matrix

        feature = {}
        feature['Type'] = 'FP3'
        feature['Sub_To'] = str([str(signals[i]) + ' ' for i in range(signals.__len__())])
        feature['Data'] = info_corr_features
        features.append(feature)

        raw_feature = dict(feature)
        raw_corr_features = list()
        for value in info_corr_features.values():
            raw_corr_features.extend(value)
        raw_feature['Data'] = raw_corr_features
        raw_features.append(raw_feature)

        return preprocessings, features, raw_features

    @staticmethod
    def extract_statistical_features(data, signal, poly_deg=3):
        data_grid = np.linspace(np.min(data), np.max(data), data.__len__())
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            futures = list([object() for i in range(4)])
            extraction_results = list([{} for i in range(4)])
            scikit_stat_preprocessing = {}
            statu_stat_preprocessing = {}
            statm_stat_preprocessing = {}
            scipy_stat_preprocessing = {}

            try:
                futures[0] = executor.submit(KernelDensityEstimator.kde_explore_scipy, data, data_grid)
                futures[1] = executor.submit(KernelDensityEstimator.kde_explore_statsmodels_u, data, data_grid)
                futures[2] = executor.submit(KernelDensityEstimator.kde_explore_statsmodels_m, data, data_grid)
                futures[3] = executor.submit(KernelDensityEstimator.kde_explore_scikitlearn, data, data_grid)
            except:
                print('Error: unable to start threads')

            wait_futures = list(futures)
            i = 0
            while wait_futures.__len__() > 0:
                f = wait_futures[i]
                try:
                    fresult = f.result(timeout=20)
                    if f.done() and f.cancelled():
                        wait_futures.pop(i)
                    elif f.done() and not f.cancelled() and not f.running():
                        extraction_results[futures.index(f)] = fresult
                        wait_futures.pop(i)
                    elif f.done() and not f.running():
                        wait_futures.pop(i)
                    if wait_futures.__len__() != 0:
                        i = (i + 1) % wait_futures.__len__()
                except:
                    if f.done() and f.cancelled():
                        wait_futures.pop(i)
                    elif f.done() and not f.cancelled() and not f.running():
                        extraction_results[futures.index(f)] = fresult
                        wait_futures.pop(i)
                    elif f.done() and not f.running():
                        wait_futures.pop(i)
                    if wait_futures.__len__() != 0:
                        i = (i + 1) % wait_futures.__len__()

            whole_pdf_polycoeffs = []
            whole_cdf_polycoeffs = []
            try:
                if extraction_results[0].__len__() > 0:
                    pdfs, bws, params = extraction_results[0][0], extraction_results[0][1], \
                                                      extraction_results[0][2]
                    try:
                        pdf_polycoeffs = Signal_Analyzer.polyfit(data=pdfs, poly_deg=poly_deg)
                        whole_pdf_polycoeffs.extend(pdf_polycoeffs)
                    except:
                        pdf_polycoeffs = [np.zeros(poly_deg + 1)]
                    scipy_stat_preprocessing = {'Method': 'SciPy', 'PDFPolyfits': pdf_polycoeffs, 'PolyfitDeg': poly_deg, 'PDFs': pdfs,
                                            'Bandwidths': bws, 'Parameters': params}
                if extraction_results[1].__len__() > 0:
                    pdfs, cdfs, bws, cumhazards, sfs, params = extraction_results[1][0], \
                                                                                               extraction_results[1][1], \
                                                                                               extraction_results[1][2], \
                                                                                               extraction_results[1][3], \
                                                                                               extraction_results[1][4], \
                                                                                               extraction_results[1][5]
                    try:
                        pdf_polycoeffs = Signal_Analyzer.polyfit(data=pdfs, poly_deg=poly_deg)
                        whole_pdf_polycoeffs.extend(pdf_polycoeffs)
                    except:
                        pdf_polycoeffs = [np.zeros(poly_deg + 1)]



                    try:
                        cdf_polycoeffs = Signal_Analyzer.polyfit(data=list(cdfs), poly_deg=poly_deg)
                        whole_cdf_polycoeffs.extend(cdf_polycoeffs)
                    except:
                        cdf_polycoeffs = [np.zeros(poly_deg + 1)]

                    statu_stat_preprocessing = {'Method': 'StatsmodelU',
                                                'PDFPolyfits': pdf_polycoeffs,
                                                'CDFPolyfits': cdf_polycoeffs,
                                                'PolyfitDeg': poly_deg,
                                                'PDFs': pdfs,
                                                'CDFs': cdfs,
                                                'Cumulative-Hazards': cumhazards,
                                                'SFs': sfs,
                                                'Bandwidths': bws,
                                                'Parameters': params}
                if extraction_results[2].__len__() > 0:
                    pdfs, cdfs, bws, loo_likelyhoods, params = extraction_results[2][0], \
                                                                                         extraction_results[2][1], \
                                                                                         extraction_results[2][2], \
                                                                                         extraction_results[2][3], \
                                                                                         extraction_results[2][4]
                    try:
                        pdf_polycoeffs = Signal_Analyzer.polyfit(data=pdfs, poly_deg=poly_deg)
                        whole_pdf_polycoeffs.extend(pdf_polycoeffs)
                    except:
                        pdf_polycoeffs = [np.zeros(poly_deg + 1)]

                    try:
                        cdf_polycoeffs = Signal_Analyzer.polyfit(data=cdfs, poly_deg=poly_deg)
                        whole_cdf_polycoeffs.extend(cdf_polycoeffs)
                    except:
                        cdf_polycoeffs = [np.zeros(poly_deg + 1)]
                    statm_stat_preprocessing = {'Method': 'StatsmodelM',
                                                'PDFPolyfits': pdf_polycoeffs,
                                                'CDFPolyfits': cdf_polycoeffs,
                                                'PolyfitDeg': poly_deg,
                                                'PDFs': pdfs,
                                                'CDFs': cdfs,
                                                'LeaveOneOut-Likelyhoods': loo_likelyhoods,
                                                'Bandwidths': bws,
                                                'Parameters': params}
                if extraction_results[3].__len__() > 0:
                    pdfs, bws, log_likelyhoods, params = extraction_results[3][0], \
                                                                                 extraction_results[3][1], \
                                                                                 extraction_results[3][2], \
                                                                                 extraction_results[3][3]
                    try:
                        pdf_polycoeffs = Signal_Analyzer.polyfit(data=pdfs, poly_deg=poly_deg)
                        whole_pdf_polycoeffs.extend(pdf_polycoeffs)
                    except:
                        pdf_polycoeffs = np.zeros(poly_deg + 1)
                    scikit_stat_preprocessing = {'Method': 'ScikitLearn',
                                                 'PDFPolyfits': pdf_polycoeffs,
                                                 'PolyfitDeg': poly_deg,
                                                 'PDFs': pdfs,
                                                 'Bandwidths': bws,
                                                 'Parameters': params,
                                                 'Log-Likelyhoods': log_likelyhoods}
            except:
                print('Error: unable to get result from threads')

            statistic_preprocessing = {'SciPy': scipy_stat_preprocessing,
                                       'StatsmodelU': statu_stat_preprocessing,
                                       'StatsmodelM': statm_stat_preprocessing,
                                       'ScikitLearn': scikit_stat_preprocessing}
            preprocessing = {}
            preprocessing['Type'] = 'PP6'
            preprocessing['Sub_To'] = signal
            preprocessing['Data'] = statistic_preprocessing

            info_stat_features = {'SciPy_PDFPolyfits': statistic_preprocessing['SciPy']['PDFPolyfits'],
                                   'StatsmodelU_PDFPolyfits': statistic_preprocessing['StatsmodelU']['PDFPolyfits'],
                                   'StatsmodelM_PDFPolyfits': statistic_preprocessing['StatsmodelM']['PDFPolyfits'],
                                   'ScikitLearn_PDFPolyfits': statistic_preprocessing['ScikitLearn']['PDFPolyfits'],
                                   'StatsmodelU_CDFPolyfits': statistic_preprocessing['StatsmodelU']['CDFPolyfits'],
                                   'StatsmodelM_CDFPolyfits': statistic_preprocessing['StatsmodelM']['CDFPolyfits']}
            feature = {}
            feature['Type'] = 'FP6'
            feature['Sub_To'] = signal
            raw_feature = dict(feature)
            raw_stat_features = list([poly_deg])
            for values in list(info_stat_features.values()):
                for value in list(values):
                    if str(value) != 'nan' and list(value).__len__() == poly_deg + 1:
                        raw_stat_features.extend(value)
                        break
            raw_feature['Data'] = raw_stat_features
            info_stat_features['Poly_deg'] = poly_deg
            feature['Data'] = info_stat_features
            return preprocessing, feature, raw_feature

    @staticmethod
    def extract_statistical_features_from_signals(data, signals):
        extraction_results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=signals.__len__()) as executor:
            futures = []
            extraction_results = []
            for samples, signal in zip(data, signals):
                try:
                    futures.append(executor.submit(Features_Extraction.extract_statistical_features, samples, signal))
                    break
                except:
                    print('Error: unable to start thread on signal %s' % signal)

            i = 0
            while futures.__len__() > 0:
                f = futures[i]
                try:
                    fresult = f.result(timeout=20)
                    if f.done() and f.cancelled():
                        futures.pop(i)
                    elif f.done() and not f.cancelled() and not f.running():
                        extraction_results.append(fresult)
                        futures.pop(i)
                    elif f.done() and not f.running():
                        futures.pop(i)
                    if futures.__len__() != 0:
                        i = (i + 1) % futures.__len__()
                except:
                    if f.done() and f.cancelled():
                        futures.pop(i)
                    elif f.done() and not f.cancelled() and not f.running():
                        extraction_results.append(fresult)
                        futures.pop(i)
                    elif f.done() and not f.running():
                        futures.pop(i)
                    if futures.__len__() != 0:
                        i = (i + 1) % futures.__len__()
        return extraction_results[0], extraction_results[1], extraction_results[2]