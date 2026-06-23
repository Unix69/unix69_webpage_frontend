import numbers
import numpy as np
from scipy.stats import gaussian_kde
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KernelDensity
from sklearn.neighbors import BallTree
from sklearn.neighbors import KDTree
from statsmodels.nonparametric.kde import KDEUnivariate
from statsmodels.nonparametric.kernel_density import KDEMultivariate

class KernelDensityEstimator(object):
    __Likelyhood_Estimation_Functions__ = {}
    __Cumulative_Estimation_Functions__ = {}

    @staticmethod
    def Init():
        KernelDensityEstimator.__Likelyhood_Estimation_Functions__ = {0: KernelDensityEstimator.kde_scipy,
                                                                      1: KernelDensityEstimator.kde_statsmodels_u,
                                                                      2: KernelDensityEstimator.kde_statsmodels_m,
                                                                      3: KernelDensityEstimator.kde_scikitlearn}
        KernelDensityEstimator.__Cumulative_Estimation_Functions__ = {0: KernelDensityEstimator.kce_scipy,
                                                                      1: KernelDensityEstimator.kce_statsmodels_u,
                                                                      2: KernelDensityEstimator.kce_statsmodels_m,
                                                                      3: KernelDensityEstimator.kce_scikitlearn}
        KernelDensityEstimator.__Explore_Estimation_Functions = {0: KernelDensityEstimator.kde_explore_scipy,
                                                                 1: KernelDensityEstimator.kde_explore_statsmodels_u,
                                                                 2: KernelDensityEstimator.kde_explore_statsmodels_m,
                                                                 3: KernelDensityEstimator.kde_explore_scikitlearn}

    @staticmethod
    def bandwidth_estimation(data, estimate_from, estimate_to, nspace, nfold):
        grid = GridSearchCV(KernelDensity(), {'bandwidth': np.linspace(estimate_from, estimate_to, nspace)},
                            cv=nfold)  # 20-fold cross-validation
        grid.fit(np.array(data).reshape(-1, 1))
        return grid.best_params_['bandwidth']

    @staticmethod
    def kde_explore_scipy(data, data_grid, bandwidth_from=0, bandwidth_to=100, nspace=10,
                          nfold=20, weigths=None, **kwargs):
        """Kernel Density Estimation with Scipy"""
        # Note that scipy weights its bandwidth by the covariance of the
        # input data.  To make the results comparable to the other methods,
        # we divide the bandwidth by the sample standard deviation here.
        bw_methods = ["scott", "silverman"]
        pdfs = []
        bws = []
        params = []
        W = 5
        gain = (bandwidth_to - bandwidth_from) / W

        for i in range(W):
            bandwidth = KernelDensityEstimator.bandwidth_estimation(data=data,
                                                                    estimate_from=i * gain,
                                                                    estimate_to=(i + 1) * gain,
                                                                    nspace=nspace, nfold=nfold)
            bw_methods.append([bandwidth])

        for bw_method in bw_methods:
            if isinstance(bw_method, int):
                bw_method = bw_method / data.std(ddof=1)
            elif isinstance(bw_method, str) or callable(bw_method):
                bw_method = bw_method
            else:
                bw_method = None

            try:
                kde = gaussian_kde(data, bw_method=bw_method, weights=weigths, **kwargs)
                pdfs.append(list(kde.evaluate(data_grid)))
            except:
                continue

            bws.append(bandwidth)
            param = {}
            param['covariance'] = kde.covariance
            param['inv_cov'] = kde.inv_cov
            param['covariance_factor'] = kde.covariance_factor
            param['factor'] = kde.factor
            param['silverman_factor'] = kde.silverman_factor()
            param['scotts_factor'] = kde.scotts_factor()
            params.append(param)
        return pdfs, bws, params

    @staticmethod
    def kde_scipy(data, data_grid, bandwidth, weigths=None, **kwargs):
        """Kernel Density Estimation with Scipy"""
        # Note that scipy weights its bandwidth by the covariance of the
        # input data.  To make the results comparable to the other methods,
        # we divide the bandwidth by the sample standard deviation here.
        if isinstance(bandwidth, int):
            bw_method = bandwidth / data.std(ddof=1)
        elif isinstance(bandwidth, str):
            bw_method = bandwidth
        else:
            bw_method = None

        kde = gaussian_kde(data, bw_method=bw_method, weights=weigths, **kwargs)
        return kde.evaluate(data_grid), bandwidth

    @staticmethod
    def kde_explore_statsmodels_u(data, data_grid, bandwidth_from=0, bandwidth_to=100,
                                  nspace=10,
                                  nfold=20, weigths=None, gridsize=None, adjust=1, cut=3, **kwargs):
        """Kernel Density Estimation with Scipy"""
        # Note that scipy weights its bandwidth by the covariance of the
        # input data.  To make the results comparable to the other methods,
        # we divide the bandwidth by the sample standard deviation here.
        bw_methods = ["scott", "silverman", "normal_reference"]
        kernels = ['biw', 'cos', 'epa', 'gau', 'tri', 'triw', 'uni']
        pdfs = []
        cdfs = []
        bws = []
        sfs = []
        cumhazards = []
        params = []
        W = 5
        gain = (bandwidth_to - bandwidth_from) / W

        for i in range(W):
            bandwidth = KernelDensityEstimator.bandwidth_estimation(data=data,
                                                                    estimate_from=i * gain,
                                                                    estimate_to=(i + 1) * gain,
                                                                    nspace=nspace, nfold=nfold)
            bw_methods.append([bandwidth])


        for kernel in kernels:
            for bw_method in bw_methods:

                if isinstance(bw_method, int) or isinstance(bw_method, float):
                    bw_method = bw_method / np.std(data, ddof=1)
                elif isinstance(bw_method, str) or callable(bw_method):
                    bw_method = bw_method
                else:
                    bw_method = None

                try:
                    kde = KDEUnivariate(data)
                    kde.fit(weights=weigths, fft=(kernel == "gau"), kernel=kernel,
                        bw=bw_method, gridsize=gridsize, adjust=adjust, cut=cut, **kwargs)
                except:
                    continue

                pdfs.append(kde.evaluate(data_grid))
                cdfs.append(kde.cdf)
                bws.append(kde.bw)
                cumhazards.append(kde.cumhazard)
                sfs.append(kde.sf)
                param = {}
                param['support'] = kde.support
                param['endog'] = kde.endog
                param['density'] = kde.density
                param['kernel'] = kde.kernel
                #param['entropy'] = kde.entropy
                param['fft'] = kernel == "gau"
                params.append(param)

        return pdfs, cdfs, bws, cumhazards, sfs, params

    @staticmethod
    def kde_statsmodels_u(data, data_grid, bandwidth, gridsize=None, adjust=1, cut=3, weigths=None, fft=True,
                          kernel='gau', **kwargs):
        """Univariate Kernel Density Estimation with Statsmodels"""
        kde = KDEUnivariate(data)
        kde.fit(weights=weigths, fft=fft, kernel=kernel, bw=bandwidth, gridsize=gridsize, adjust=adjust, cut=cut,
                **kwargs)
        return kde.evaluate(data_grid), kde.bw

    @staticmethod
    def kde_explore_statsmodels_m(data, data_grid, bandwidth_from=0, bandwidth_to=100,
                                  nspace=10,
                                  nfold=20, defaults=0, **kwargs):
        bw_methods = ["cv_ls", "cv_ml", "normal_reference"]
        variable_types = ['c', 'u', 'o']
        W = 5
        gain = (bandwidth_to - bandwidth_from) / W
        for i in range(W):
            bandwidth = KernelDensityEstimator.bandwidth_estimation(data=data,
                                                                        estimate_from=i * gain,
                                                                        estimate_to=(i + 1) * gain,
                                                                        nspace=nspace, nfold=nfold)
            bw_methods.append([bandwidth])
        pdfs = []
        cdfs = []
        loo_likelyhoods = []
        params = []
        bws = []

        for variable_type in variable_types:
            for bw_method in bw_methods:
                try:
                    kde = KDEMultivariate(data=[data], bw=bw_method, var_type=variable_type, **kwargs)
                    pdfs.append(kde.pdf(data_grid))
                    cdfs.append(kde.cdf(data_grid))
                    loo_likelyhoods.append(kde.loo_likelihood(kde.bw))
                except:
                    continue
                bws.append(kde.bw)
                param = {}
                param['data_type'] = kde.data_type
                param['efficient'] = kde.efficient
                param['k_vars'] = kde.k_vars
                param['nobs'] = kde.nobs
                param['n_jobs'] = kde.n_jobs
                param['n_sub'] = kde.n_sub
                param['n_res'] = kde.n_res
                param['var_type'] = kde.var_type
                param['return_median'] = kde.return_median
                param['imse'] = kde.imse(kde.bw)
                params.append(param)

        return pdfs, cdfs, bws, loo_likelyhoods, params

    @staticmethod
    def kde_statsmodels_m(data, data_grid, bandwidth, defaults=0, variable_type='c', **kwargs):
        """Multivariate Kernel Density Estimation with Statsmodels"""
        if isinstance(bandwidth, int) or isinstance(bandwidth, float):
            bandwidth = 'cv_ml'
        kde = KDEMultivariate(data=[data], bw=bandwidth, var_type=variable_type, **kwargs)
        return kde.pdf(data_grid), kde.bw

    @staticmethod
    def kde_explore_scikitlearn(data, data_grid, bandwidth_from=0, bandwidth_to=100,
                                nspace=10,
                                nfold=20, defaults=0, rtol=0, atol=0, **kwargs):
        """Kernel Density Estimation with Scipy"""
        # Note that scipy weights its bandwidth by the covariance of the
        # input data.  To make the results comparable to the other methods,
        # we divide the bandwidth by the sample standard deviation here.
        W = 10
        bandwidths = []
        gain = (bandwidth_to - bandwidth_from) / W
        for i in range(W):
            bandwidths.append(KernelDensityEstimator.bandwidth_estimation(data=data,
                                                                        estimate_from=i * gain,
                                                                        estimate_to=(i + 1) * gain,
                                                                        nspace=nspace, nfold=nfold))
        bw_methods = list([b for b in bandwidths])
        kernels = ['gaussian', 'tophat', 'epanechnikov', 'exponential', 'linear', 'cosine']
        algorithms = ["ball_tree", "kd_tree", "auto"]
        metrics = []

        for metric in BallTree.valid_metrics:
            metrics.append(metric)
        for metric in KDTree.valid_metrics:
            metrics.append(metric)

        metrics = np.unique(metrics)

        pdfs = []
        bws = []
        log_likelyhoods = []
        params = []

        for metric in metrics:
            for algorithm in algorithms:
                for kernel in kernels:
                    for bw_method in bw_methods:
                        if not isinstance(bw_method, numbers.Number):
                            bw_method = KernelDensityEstimator.bandwidth_estimation(data=data,
                                                                        estimate_from=bandwidth_from + (i * gain),
                                                                        estimate_to=bandwidth_to + ((i + 1) * gain),
                                                                        nspace=nspace, nfold=nfold)
                        try:
                            kde = KernelDensity(rtol=rtol, atol=atol, bandwidth=bw_method, metric=metric,
                                            algorithm=algorithm,
                                            kernel=kernel, **kwargs)
                            kde.fit(data.reshape(-1,1))
                            # score_samples() returns the log-likelihood of the samples
                            log_pdf = kde.score_samples(data_grid.reshape(-1, 1))
                        except:
                            continue


                        pdfs.append(np.exp(log_pdf))
                        bws.append(kde.bandwidth)
                        log_likelyhoods.append(kde.score(data_grid.reshape(-1, 1)))
                        param = {}
                        param['algorithm'] = kde.algorithm
                        param['kernel'] = kde.kernel
                        param['atol'] = kde.atol
                        param['rtol'] = kde.rtol
                        param['breadth_first'] = kde.breadth_first
                        param['feature_names_in_'] = kde.n_features_in_
                        param['leaf_size'] = kde.leaf_size
                        param['tree_'] = kde.tree_
                        param['metric'] = kde.metric
                        params.append(param)

        return pdfs, bws, log_likelyhoods, params

    @staticmethod
    def kde_scikitlearn(data, data_grid, bandwidth, rtol=0, atol=0, metric='euclidean', kernel='gaussian',
                        algorithm='auto', **kwargs):
        """Kernel Density Estimation with Scikit-learn"""

        kde = KernelDensity(rtol=rtol, atol=atol, bandwidth=bandwidth, metric=metric, algorithm=algorithm,
                            kernel=kernel, **kwargs)
        kde.fit(np.array(data).reshape(-1, 1))
        # score_samples() returns the log-likelihood of the samples
        log_pdf = kde.score_samples(data_grid[:, np.newaxis])
        return np.exp(log_pdf), kde.bandwidth

    @staticmethod
    def kde_best_scikitlearn(data, data_grid, bandwidth, metric='euclidean', kernel='gaussian', algorithm='auto',
                             bandwidth_estimate_from=0, bandwidth_estimate_to=100, nspace=100):
        """Best Kernel Density Estimation with Scikit-learn"""
        grid = GridSearchCV(KernelDensity(bandwidth=bandwidth, metric=metric, algorithm=algorithm, kernel=kernel),
                            {'bandwidth': np.logspace(bandwidth_estimate_from, bandwidth_estimate_to, nspace)})
        grid.estimator.fit(np.array(data).reshape(-1, 1))
        # score_samples() returns the log-likelihood of the samples

        log_pdf = grid.estimator.score_samples(data_grid[:, np.newaxis])
        return np.exp(log_pdf), grid.estimator.__getattribute__('bandwidth'), grid.estimator

    @staticmethod
    def kce_statsmodels_u(data, data_grid, bandwidth, weigths=None, fft=True, kernel='gau', **kwargs):
        """Univariate Kernel Cumulative Density Estimation with Statsmodels"""
        kce = KDEUnivariate(data)
        kce.fit(weights=weigths, fft=fft, kernel=kernel, bw=bandwidth, **kwargs)
        return kce.cdf, kce.bw

    @staticmethod
    def kce_statsmodels_m(data, data_grid, bandwidth, variable_type='c', **kwargs):
        """Multivariate Kernel Cumulative Density Estimation with Statsmodels"""
        if isinstance(bandwidth, int) or isinstance(bandwidth, float):
            bandwidth = 'cv_ml'
        kce = KDEMultivariate(data=[data], bw=bandwidth, var_type=variable_type, **kwargs)
        return kce.cdf(data_grid), kce.bw

    @staticmethod
    def kce_scipy(data, data_grid, bandwidth, **kwargs):
        return [], bandwidth

    @staticmethod
    def kce_scikitlearn(data, data_grid, bandwidth, **kwargs):
        return [], bandwidth

    @staticmethod
    def pdf_estimation(data, data_grid, method, bandwidth, band_est_enable, bandwidth_estimate_from=0,
                       bandwidth_estimate_to=100, nspace=100,
                       nfold=20, **kwargs):

        if isinstance(band_est_enable, bool) and band_est_enable == True:
            bandwidth = KernelDensityEstimator.bandwidth_estimation(data, estimate_from=bandwidth_estimate_from,
                                                                    estimate_to=bandwidth_estimate_to, nspace=nspace,
                                                                    nfold=nfold)

        return KernelDensityEstimator.__Likelyhood_Estimation_Functions__[method](data, data_grid, bandwidth, **kwargs)

    @staticmethod
    def cdf_estimation(data, data_grid, method, bandwidth, band_est_enable, bandwidth_estimate_from=0,
                       bandwidth_estimate_to=100, nspace=100,
                       nfold=20, **kwargs):
        if isinstance(band_est_enable, bool) and band_est_enable == True:
            bandwidth = KernelDensityEstimator.bandwidth_estimation(data, estimate_from=bandwidth_estimate_from,
                                                                    estimate_to=bandwidth_estimate_to, nspace=nspace,
                                                                    nfold=nfold)
        return KernelDensityEstimator.__Cumulative_Estimation_Functions__[method](data, data_grid, bandwidth, **kwargs)

    @staticmethod
    def get_pdf_estimation_method(method):
        return str(KernelDensityEstimator.__Likelyhood_Estimation_Functions__[method].__name__)

    @staticmethod
    def get_cdf_estimation_method(method):
        return str(KernelDensityEstimator.__Cumulative_Estimation_Functions__[method].__name__)