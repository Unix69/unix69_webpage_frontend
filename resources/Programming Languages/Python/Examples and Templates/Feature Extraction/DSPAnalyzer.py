import numbers
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from scipy.stats import pearsonr
from scipy.stats import spearmanr

class Signal_Analysis(object):
    def __init__(self, signals=[]):
        self.__pearsons__ = []
        self.__spearmans__ = []
        self.__means__ = []
        self.__stds__ = []
        self.__couples__ = []
        self.__pvalues__ = []
        self.__covariance_matrixes__ = []
        self.__correlation_pearsons_matrix__ = []
        self.__correlation_kendalls_matrix__ = []
        self.__correlation_spearmans_matrix__ = []
        self.__correlation_coefficients__ = []
        self.__correlation_ = []
        self.__signals__ = [str(s) for s in signals]

    def correlation(self, index=int(-1)):
        if -1 == index:
            return self.__correlation_
        elif self.__correlation_.__len__() > index > 0:
            return self.__correlation_[index]
        else:
            return []

    def couples(self, index=int(-1)):
        if -1 == index:
            return self.__couples__
        elif self.__couples__.__len__() > index > 0:
            return self.__couples__[index]
        else:
            return []

    def pearsons(self, index=int(-1)):
        if -1 == index:
            return self.__pearsons__
        elif index > self.__pearsons__.__len__() or index < 0:
            return []
        else:
            return self.__pearsons__[index]

    def pvalues(self, index=int(-1)):
        if -1 == index:
            return self.__pvalues__
        elif index > self.__pvalues__.__len__() or index < 0:
            return []
        else:
            return self.__pvalues__[index]

    def spearmans(self, index=int(-1)):
        if -1 == index:
            return self.__spearmans__
        elif index > self.__spearmans__.__len__() or index < 0:
            return []
        else:
            return self.__spearmans__[index]

    def covariance_matrixes(self, index=int(-1), rindex=int(-1), cindex=int(-1)):
        if -1 == index and -1 == rindex and -1 == cindex:
            return self.__covariance_matrixes__
        elif self.__covariance_matrixes__.__len__() > index > 0:
            if -1 == rindex and -1 == cindex:
                return self.__covariance_matrixes__[index, :, :]
            elif self.__covariance_matrixes__.__len__() > rindex > 0 and -1 == cindex:
                return self.__covariance_matrixes__[index, rindex, :]
            elif self.__covariance_matrixes__[0].__len__() > cindex > 0 and -1 == rindex:
                return self.__covariance_matrixes__[index, :, cindex]
            elif self.__covariance_matrixes__.__len__() > rindex > 0 and self.__covariance_matrixes__[
                0].__len__() > cindex > 0:
                return self.__covariance_matrixes__[index, rindex, cindex]
        else:
            return [[[]]]

    def correlation_kendalls_matrix(self, rindex=int(-1), cindex=int(-1)):
        if -1 == rindex and -1 == cindex:
            return self.__correlation_kendalls_matrix__
        elif self.__correlation_kendalls_matrix__.__len__() > rindex > 0 and -1 == cindex:
            return self.__correlation_kendalls_matrix__[rindex, :]
        elif self.__correlation_kendalls_matrix__[0].__len__() > cindex > 0 and -1 == rindex:
            return self.__correlation_kendalls_matrix__[:, cindex]
        elif self.__correlation_kendalls_matrix__.__len__() > rindex > 0 and self.__correlation_kendalls_matrix__[
            0].__len__() > cindex > 0:
            return self.__correlation_kendalls_matrix__[rindex, cindex]
        else:
            return [[]]

    def correlation_spearmans_matrix(self, rindex=int(-1), cindex=int(-1)):
        if -1 == rindex and -1 == cindex:
            return self.__correlation_spearmans_matrix__
        elif self.__correlation_spearmans_matrix__.__len__() > rindex > 0 and -1 == cindex:
            return self.__correlation_spearmans_matrix__[rindex, :]
        elif self.__correlation_spearmans_matrix__[0].__len__() > cindex > 0 and -1 == rindex:
            return self.__correlation_spearmans_matrix__[:, cindex]
        elif self.__correlation_spearmans_matrix__.__len__() > rindex > 0 and self.__correlation_spearmans_matrix__[
            0].__len__() > cindex > 0:
            return self.__correlation_spearmans_matrix__[rindex, cindex]
        else:
            return [[]]

    def correlation_pearsons_matrix(self, rindex=int(-1), cindex=int(-1)):
        if -1 == rindex and -1 == cindex:
            return self.__correlation_pearsons_matrix__
        elif self.__correlation_pearsons_matrix__.__len__() > rindex > 0 and -1 == cindex:
            return self.__correlation_pearsons_matrix__[rindex, :]
        elif self.__correlation_pearsons_matrix__[0].__len__() > cindex > 0 and -1 == rindex:
            return self.__correlation_pearsons_matrix__[:, cindex]
        elif self.__correlation_pearsons_matrix__.__len__() > rindex > 0 and self.__correlation_pearsons_matrix__[
            0].__len__() > cindex > 0:
            return self.__correlation_pearsons_matrix__[rindex, cindex]
        else:
            return [[]]

    def set_correlation_pearsons_matrix(self, correlation_matrix):
        self.__correlation_pearsons_matrix__.append(correlation_matrix)

    def set_correlation_kendalls_matrix(self, correlation_matrix):
        self.__correlation_kendalls_matrix__.append(correlation_matrix)

    def set_correlation_spearmans_matrix(self, correlation_matrix):
        self.__correlation_spearmans_matrix__.append(correlation_matrix)

    def correlation_coeff(self, index=int(-1), rindex=int(-1), cindex=int(-1)):
        if -1 == index and -1 == rindex and -1 == cindex:
            return self.__correlation_coefficients__
        elif self.__correlation_coefficients__.__len__() > index > 0:
            if -1 == rindex and -1 == cindex:
                return self.__correlation_coefficients__[index, :, :]
            elif self.__correlation_coefficients__.__len__() > rindex > 0 and -1 == cindex:
                return self.__correlation_coefficients__[index, rindex, :]
            elif self.__correlation_coefficients__[0].__len__() > cindex > 0 and -1 == rindex:
                return self.__correlation_coefficients__[index, :, cindex]
            elif self.__correlation_coefficients__.__len__() > rindex > 0 and self.__correlation_coefficients__[
                0].__len__() > cindex > 0:
                return self.__correlation_coefficients__[index, rindex, cindex]
        else:
            return [[]]


class Signal_Analyzer(object):
    @staticmethod
    def polyfit(data, poly_deg=3):
        poly_data = []
        for signal in list(data):
            if str(signal) == 'nan':
                continue
            signal = list(signal[[(not str(s) == 'nan' and not s == np.nan) for s in signal ]])
            if signal.__len__() <= 0:
                continue
            signal_x = np.linspace(np.min(signal), np.max(signal), signal.__len__())
            try:
                poly_signal = np.polyfit(x=signal_x, y=signal, deg=poly_deg)
            except:
                continue
            poly_data.append(poly_signal)
        return poly_data


    @staticmethod
    def correlation(data, signals=None, plot=False):

        for i in range(data.__len__() - 1):
            if data[i, :].__len__() != data[i + 1, :].__len__():
                return

        if data.__len__() < 2:
            return

        # Get all combinations of data indexes
        # and length 2
        from itertools import combinations
        combindexes = combinations([i for i in range(data.__len__())], 2)

        # summarize
        sig_analysis = Signal_Analysis(signals=signals)

        for i, j in list(combindexes):
            d = data[i, :]
            s = data[j, :]

            print('Correlate: var=%i var=%i' % (i, j))
            print('var%i: mean=%.3f stdv=%.3f' % (i, float(np.mean(d).__round__(3)), float(np.std(d)).__round__(3)))
            print('var%i mean=%.3f stdv=%.3f' % (j, float(np.mean(s).__round__(3)), float(np.std(s)).__round__(3)))


            if plot:
                # plot
                fig = plt.figure()
                plt.scatter(d, s, color='blue', alpha=1, lw=3)
                plt.xlim([np.min(d) - np.std(d), np.max(d) + np.std(d)])
                plt.ylim([np.min(s) - np.std(s), np.max(s) + np.std(s)])
                plt.title('Scatter Plot', fontsize=8, loc='center')
                plt.suptitle('Scatter Plot (Var%i, Var%i)' % (i, j))
                plt.xlabel(xlabel='Var' + str(i) + '(mean = ' + str(float(np.mean(d)).__round__(3)) + ', stdv = ' + str(
                    float(np.std(d)).__round__(3)) + ')', fontsize=8, loc='center', labelpad=3)
                plt.ylabel(ylabel='Var' + str(j) + '(mean = ' + str(float(np.mean(s)).__round__(3)) + ', stdv = ' + str(
                    float(np.std(s)).__round__(3)) + ')', fontsize=8, loc='center', labelpad=3)

            d_norm = (d - np.mean(d)) / np.std(d)
            s_norm = (s - np.mean(s)) / np.std(s)

            if plot:
                # plot
                fig = plt.figure()
                plt.scatter(d_norm, s_norm, color='red', alpha=1, lw=3)
                plt.xlim([np.min(d_norm) - np.std(d_norm), np.max(d_norm) + np.std(d_norm)])
                plt.ylim([np.min(s_norm) - np.std(s_norm), np.max(s_norm) + np.std(s_norm)])
                plt.title('Scatter Plot', fontsize=8, loc='center')
                plt.suptitle('Normalized Scatter Plot (Var%i, Var%i)' % (i, j))
                plt.xlabel(
                    xlabel='Norm Var' + str(i) + '(mean = ' + str(float(np.mean(d_norm)).__round__(3)) + ', stdv = ' + str(
                        float(np.std(d_norm)).__round__(3)) + ')',
                    fontsize=8, loc='center', labelpad=3)
                plt.ylabel(ylabel='Norm Var' + str(j) + '(mean = ' + str(
                    float(np.mean(s_norm)).__round__(3)) + ', stdv = ' + str(float(np.std(s_norm)).__round__(3)) + ')',
                           fontsize=8, loc='center', labelpad=3)
            covariance = np.cov(d, s)
            print('Covariance Matrix(Var%i, Var%i)' % (i, j))
            print(covariance)
            corr = covariance / (np.std(d) * np.std(s))
            print('Correlation(Var%i, Var%i): %.3f' % (i, j, corr[0][1]))
            pcorr, _ = pearsonr(d, s)
            print('Pearsons Correlation(Var%i, Var%i): %.3f' % (i, j, pcorr))
            scorr, pval = spearmanr(a=d, b=s)
            print('Spearmans Correlation and PValue(Var%i, Var%i): %.3f, %.3f' % (i, j, scorr, pval))

            corr_coeff = np.corrcoef(x=d, y=s)
            print('Correlation Coefficients(Var%i, Var%i)' % (i, j))
            print(corr_coeff)
            sig_analysis.couples().append((i, j))
            sig_analysis.pearsons().append(pcorr)
            sig_analysis.spearmans().append(scorr)
            sig_analysis.pvalues().append(pval)
            sig_analysis.correlation().append(corr)
            sig_analysis.correlation_coeff().append(corr_coeff)
            sig_analysis.covariance_matrixes().append(covariance)

        nc = data[0].__len__()
        nr = data.__len__()
        data = np.transpose(data)
        dataframe = pd.DataFrame(data=data)
        correlation_matrix = dataframe.corr(method='pearson')
        sig_analysis.set_correlation_pearsons_matrix(correlation_matrix)
        correlation_matrix = dataframe.corr(method='kendall')
        sig_analysis.set_correlation_kendalls_matrix(correlation_matrix)
        correlation_matrix = dataframe.corr(method='spearman')
        sig_analysis.set_correlation_spearmans_matrix(correlation_matrix)
        print('Correlation Matrix')
        return sig_analysis

    @staticmethod
    def fft(data=np.zeros([], dtype=int), signal=None, plot=False):
        if 0 < data.__len__() < 1:
            sp = np.zeros([])
            freq = np.zeros([])
            return sp, freq
        nsamples = data.__len__()
        mean = np.mean(data)
        std = np.std(data)
        t = np.arange(nsamples)
        print('mean(' + signal + ') = ' + str(mean))
        print('std(' + signal + ') = ' + str(std))

        complex_data = False
        real_data = False

        complex_data = (data[lambda d: isinstance(d, numbers.Complex)]).__len__() == 0
        real_value = (data[lambda d: isinstance(d, numbers.Real)]).__len__() == 0

        if complex_data:
            sp = np.fft.fft(data)
            freq = np.fft.fftfreq(t.shape[-1])
        elif real_value:
            sp = np.fft.rfft(data)
            freq = np.fft.rfftfreq(t.shape[-1])
        else:
            sp = np.zeros([])
            freq = np.zeros([])
            return sp, freq

        if plot:
            # plot fft of data
            fig = plt.figure()
            plt.plot(freq, sp.real, freq, sp.imag)
            plt.xlim([0, np.max(freq) + np.std(freq)])
            plt.ylim([0, np.max(sp.real) + np.std(sp.real)])
            plt.title(label='FFT analysis', fontsize=8, loc='center')
            plt.suptitle(t='FFT of ' + signal + ' - Real and Imag')
            plt.xlabel(
                xlabel='Frequency (Hz) - (Bandwidth = ' + str(float(np.max(freq)).__round__(3)) + ', fftsamples = ' + str(
                    sp.__len__()), fontsize=8,
                loc='center',
                labelpad=3)
            plt.ylabel(ylabel='FFT Module and Phase', fontsize=10, loc='center', labelpad=6)

        return sp, freq

    @staticmethod
    def frequency_peaks_analysis(data, data_grid, signal=None, plot=False):
        if plot:
            # plot of x
            fig = plt.figure()
            plt.plot(data_grid, data)
            plt.xlim([0, np.max(data_grid) + np.std(data_grid)])
            plt.ylim([0, np.max(data) + np.std(data)])
            plt.title(label='Time analysis', fontsize=8, loc='center')
            plt.suptitle(t='Signal: ' + signal + ' -')
            plt.xlabel(xlabel='Time (s) - support max = ' + str(float(np.max(data_grid)).__round__(3)) + 's', fontsize=8,
                       loc='center',
                       labelpad=3)
            plt.ylabel(ylabel='X(t)', fontsize=10, loc='center', labelpad=6)

        print('mean(' + signal + ') = ' + str(np.mean(data)))
        print('std(' + signal + ') = ' + str(np.std(data)))

        # compute fft of x
        sp = np.fft.fft(data)
        freq = np.fft.fftfreq(data_grid.shape[-1])

        print('mean(' + signal + ') = ' + str(float(np.mean(data)).__round__(3)))
        print('maxfreq(' + signal + ') = ' + str(float(np.max(freq)).__round__(3)))
        if plot:
            # plot fft of x
            fig = plt.figure()
            plt.plot(freq, sp.real, freq, sp.imag)
            plt.xlim([0, np.max(freq) + np.std(freq)])
            plt.ylim([0, np.max(sp.real) + np.std(sp.real)])
            plt.title(label='FFT analysis', fontsize=8, loc='center')
            plt.suptitle(t='FFT of ' + signal + ' - Real and Imag')
            plt.xlabel(xlabel='Frequency (Hz) - Bandwidth = ' + str(float(np.max(freq)).__round__(3)), fontsize=8,
                   loc='center',
                   labelpad=3)
            plt.ylabel(ylabel='FFT Module and Phase', fontsize=10, loc='center', labelpad=6)

        # initialize freq-spectrum map
        freq_sp = {}
        for f, v in zip(freq, sp.real):
            freq_sp[f] = v

        # Search for peak values not overlapsed windows
        bandwidth = int(sp.real.__len__() / 100)
        npeaks_find = 3
        old_peak = 0
        old_peak_value = 0
        old_freq_peak = 0
        new_peak = 0
        new_peak_value = 0
        new_freq_peak = 0
        peak_freqs = {}
        imax_found = 0
        imin_found = 0
        for i in range(0, sp.real.__len__(), bandwidth):
            spseq = list(sp.real[i:i + bandwidth])
            npeaks_find = np.amin([3, int(spseq.__len__() / 2)])
            for j in range(npeaks_find):
                imax_found = np.argmax(spseq)
                spseq.remove(spseq[imax_found])
                new_peak = i + imax_found
                new_peak_value = sp.real[new_peak]
                new_freq_peak = freq[new_peak]
                peak_freqs[new_freq_peak] = new_peak_value
                imin_found = np.argmin(spseq)
                spseq.remove(spseq[imin_found])
                new_peak = i + imin_found
                new_peak_value = sp.real[new_peak]
                new_freq_peak = freq[new_peak]
                peak_freqs[new_freq_peak] = new_peak_value

        if plot:
            # plot fft of x
            fig = plt.figure(figsize=(8, 4))
            plt.plot(peak_freqs.keys(), peak_freqs.values(), color='blue', alpha=1, lw=3)
            plt.plot(freq, sp.real, color='red', alpha=1, lw=3)
            plt.xlim([0, np.max(freq) + np.std(freq)])
            plt.ylim([0, np.max(sp.real) + np.std(sp.real)])
            plt.title(label='FFT analysis', fontsize=8, loc='center')
            plt.suptitle(t='FFT Real(red) vs FFT Peaks(blue)')
            plt.xlabel(xlabel='Frequency (Hz) - Bandwidth = ' + str(float(np.max(freq)).__round__(3)) + 'Hz npeaks = ' + str(
                int(peak_freqs.values().__len__())), fontsize=8, loc='center', labelpad=3)
            plt.ylabel(ylabel='FFT Spectrum', fontsize=10, loc='center', labelpad=6)

        # Search for peak values not overlapsed windows
        npeaks_find = 3
        old_peak = 0
        old_peak_value = 0
        old_freq_peak = 0
        new_peak = 0
        new_peak_value = 0
        new_freq_peak = 0
        peak_freqs = {}
        K = 3
        imax_found = 0
        imin_found = 0
        for i in range(0, sp.real.__len__(), K):
            spseq = list(sp.real[i:i + bandwidth])
            npeaks_find = np.amin([3, int(spseq.__len__() / 2)])

            for j in range(int(npeaks_find)):
                imax_found = np.argmax(spseq)
                spseq.remove(spseq[imax_found])
                new_peak = i + imax_found
                new_peak_value = sp.real[new_peak]
                new_freq_peak = freq[new_peak]
                peak_freqs[new_freq_peak] = new_peak_value
                imin_found = np.argmin(spseq)
                spseq.remove(spseq[imin_found])
                new_peak = i + imin_found
                new_peak_value = sp.real[new_peak]
                new_freq_peak = freq[new_peak]

        if plot:
            # plot fft of x
            fig = plt.figure(figsize=(8, 4))
            plt.plot(peak_freqs.keys(), peak_freqs.values(), color='blue', alpha=1, lw=3)
            plt.plot(freq, sp.real, color='red', alpha=1, lw=3)
            plt.xlim([0, np.max(freq) + np.std(freq)])
            plt.ylim([0, np.max(sp.real) + np.std(sp.real)])
            plt.title(label='FFT analysis', fontsize=8, loc='center')
            plt.suptitle(t='FFT Real(red) vs FFT Peaks(blue)')
            plt.xlabel(xlabel='Frequency (Hz) - Bandwidth = ' + str(float(np.max(freq)).__round__(3)) + 'Hz npeaks = ' + str(
                int(peak_freqs.values().__len__())), fontsize=8, loc='center', labelpad=3)
            plt.ylabel(ylabel='FFT Spectrum', fontsize=10, loc='center', labelpad=6)

        # Recostruct signal x from fft
        xr = np.fft.ifft(np.array(list(peak_freqs.values()), dtype=complex))
        if plot:
            # plot xr from fft
            fig = plt.figure(figsize=(8, 4))
            plt.plot(np.linspace(0, 10, xr.__len__()), xr, color='green', alpha=1, lw=3)
            # plt.plot(t, x, color='red', alpha=1, lw=3)
            plt.xlim([0, np.max(data_grid) + np.std(data_grid)])
            plt.ylim([0, np.max(data) + np.std(data)])
            plt.title(label='FFT reconstruction analysis', fontsize=8, loc='center')
            plt.suptitle(t='Recostructed(blue) vs Original(red)')
            plt.xlabel(xlabel='Frequency (Hz) - Bandwidth = ' + str(float(np.max(freq)).__round__(3)) + 'Hz npeaks = ' + str(
                int(peak_freqs.values().__len__())), fontsize=8, loc='center', labelpad=3)
            plt.ylabel(ylabel='FFT Spectrum', fontsize=10, loc='center', labelpad=6)

        return sp, freq, peak_freqs, freq_sp, xr

