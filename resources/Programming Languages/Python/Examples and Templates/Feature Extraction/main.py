# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import array
import numbers
from itertools import combinations
from threading import Thread

import smtplib

import pandas as pd

import numpy as np
import types as tp
import scipy
from matplotlib import pyplot as plt
from scipy.stats import gaussian_kde
from scipy.stats import kde
from scipy.stats import pearsonr
from scipy.stats import spearmanr

from scipy.stats.distributions import norm
from scipy.stats.distributions import uniform
from scipy.stats.distributions import gamma
from scipy.stats.distributions import poisson
from scipy.stats.distributions import binom

from sklearn.metrics import roc_curve, auc

from sklearn.model_selection import GridSearchCV
from sklearn.model_selection._search import BaseSearchCV
from sklearn.neighbors import KernelDensity
from sklearn.base import BaseEstimator
from sklearn.neighbors import BallTree
from sklearn.neighbors import KDTree
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

from statsmodels.nonparametric.kde import KDEUnivariate
from statsmodels.nonparametric.kernel_density import KDEMultivariate

import json
from pymongo import MongoClient
import concurrent.futures

from DSPAnalyzer import Signal_Analyzer
from KDEstimator import KernelDensityEstimator
from Features import Features_Extraction
from PCAnalyzer import PCA_Analyzer


def foo(bar):
    print('hello {}'.format(bar))
    return bar, bar

def estimate_probability(data):
    pdf_real = norm(np.mean(data), np.std(data)).pdf(np.linspace(np.min(data), np.max(data), data.__len__()))

    KernelDensityEstimator.Init()
    pdf, best_bandwidth, best_estimator = KernelDensityEstimator.kde_best_scikitlearn(data=data, data_grid=np.linspace(
        np.min(data), np.max(data), data.__len__()),
                                                                                      bandwidth=1.0,
                                                                                      bandwidth_estimate_from=0,
                                                                                      bandwidth_estimate_to=10,
                                                                                      nspace=10)

    fig = plt.figure(figsize=(8, 4))
    fig.subplots_adjust(wspace=0.25)
    plt.plot(np.linspace(np.min(data), np.max(data), data.__len__()), data=pdf, color='blue', alpha=1, lw=3)
    plt.fill(np.linspace(np.min(data), np.max(data), data.__len__()), data=pdf_real, ec='gray', fc='gray', alpha=0.5)
    plt.title(KernelDensityEstimator.get_pdf_estimation_method(3), fontsize=8, loc='center')
    plt.suptitle('Best Probability Density Function Estimation')
    plt.xlabel(xlabel='Dataset support (Bandwidth = ' + str(float(best_bandwidth).__round__(3)) + ' kernel = ' +
                      best_estimator.__getattribute__('kernel') + ' metric = ' + best_estimator.__getattribute__(
        'metric')
                      + ' nfeatures = ' + str(best_estimator.__getattribute__('n_features_in_')) + ')', fontsize=8,
               loc='center', labelpad=3)

    pdfs = {}
    bws_pdf = {}
    j = 0

    for i in range(4):

        pdf, bw = KernelDensityEstimator.pdf_estimation(data=data, data_grid=np.linspace(np.min(data), np.max(data),
                                                                                         data.__len__()), method=i,
                                                        bandwidth=1.0, band_est_enable=True,
                                                        bandwidth_estimate_from=0, bandwidth_estimate_to=10, nspace=10,
                                                        nfold=10)
        if len(pdf) > 0:
            pdfs[j] = pdf
            bws_pdf[j] = bw
            j += 1

    # Plot the three kernel density estimates
    fig, ax = plt.subplots(1, j, sharey=True, figsize=(32, 4))
    fig.subplots_adjust(wspace=0.25)
    ax[0].set_ylabel(ylabel='Estimated Probability', fontsize=9, loc='center', labelpad=50, fontdict={'color': 'blue'})
    plt.suptitle('Probability Density Function Estimation')

    for i in range(j):
        ax[i].plot(np.linspace(np.min(data), np.max(data), data.__len__()), pdfs[i], color='blue', alpha=1, lw=3)
        ax[i].fill(np.linspace(np.min(data), np.max(data), data.__len__()), pdf_real, ec='gray', fc='gray', alpha=0.5)
        ax[i].set_title(KernelDensityEstimator.get_pdf_estimation_method(i), fontsize=8, loc='center')
        ax[i].set_xlabel(xlabel='Dataset support (Bandwidth = ' + str(float(bws_pdf[i]).__round__(3)) + ')',
                         fontsize=8,
                         loc='center', labelpad=3)

    cdfs = {}
    bws_cdf = {}
    j = 0

    for i in range(4):
        cdf, bw = KernelDensityEstimator.cdf_estimation(data, np.linspace(np.min(data), np.max(data), data.__len__()),
                                                        method=i, bandwidth=1.0, band_est_enable=True,
                                                        bandwidth_estimate_from=0,
                                                        bandwidth_estimate_to=10,
                                                        nspace=10, nfold=10)
        if len(cdf) > 0:
            cdfs[j] = cdf
            bws_cdf[j] = bw
            j = j + 1

    # Plot the three kernel density estimates
    fig, ax = plt.subplots(1, j, sharey=True, figsize=(32, 4))
    fig.subplots_adjust(wspace=0.25)
    ax[0].set_ylabel(ylabel='Estimated Cumulative Probability', fontsize=9, loc='center', labelpad=50,
                     fontdict={'color': 'red'})
    plt.suptitle(t='Cumulative Density Function Estimation')

    for i in range(j):
        ax[i].plot(np.linspace(np.min(data), np.max(data), len(cdfs[i])), cdfs[i], color='red', alpha=0.5, lw=3)
        ax[i].set_title(label=KernelDensityEstimator.get_cdf_estimation_method(method=i), fontsize=8, loc='center')
        ax[i].set_xlabel(xlabel='CDF support (Bandwidth = ' + str(float(bws_cdf[i]).__round__(3)) + ')', fontsize=8,
                         loc='center', labelpad=3)

    plt.show()
    return


def continues():
    traindata = np.zeros(shape=(1000, 2))
    testdata = np.zeros(shape=(1000, 2))
    valdata = np.zeros(shape=(1000, 2))

    traindata[:, 0] = np.concatenate([norm(0, 1).rvs(800), norm(1, 1).rvs(200)])
    traindata[:, 1] = np.concatenate([norm(0, 1).rvs(800), norm(2, 1).rvs(200)])
    testdata[:, 0] = np.concatenate([norm(-1, 1).rvs(600), norm(1, 0.3).rvs(400)])
    testdata[:, 1] = np.concatenate([norm(-1, 1).rvs(600), norm(1, 0.3).rvs(400)])
    valdata[:, 0] = np.concatenate([norm(-0.8, 1.0).rvs(800), norm(1, 0.3).rvs(200)])
    valdata[:, 1] = np.concatenate([norm(-0.8, 1.0).rvs(800), norm(1, 0.3).rvs(200)])

    kdef = KernelDensity()
    kdef.fit(traindata)
    scores = kdef.score_samples(valdata)

    # plot Log-Likelyhood of X = {x0, x1} respect to x0
    features = 'X'
    fig = plt.figure()
    plt.scatter(valdata[:, 0], scores, alpha=1, lw=3)
    plt.xlim([np.min(valdata[:, 0]) - np.std(valdata[:, 0]), np.max(valdata[:, 0]) + np.std(valdata[:, 0])])
    plt.ylim([np.min(scores) - np.std(scores), np.max(scores) + np.std(scores)])
    plt.title(label='Log Likelyhood estimation', fontsize=8, loc='center')
    plt.suptitle(t='Log-Likelyhood of features ' + features)
    plt.xlabel(xlabel=features + ' with support [' + str(np.min(valdata[:, 0]).__round__(3)) + ',' + str(
        np.max(valdata[:, 0]).__round__(3)) + ']', fontsize=8, loc='center', labelpad=3)
    plt.ylabel(ylabel='Log-Likelyhood with support[ ' + str(np.min(scores).__round__(3)) + ',' + str(
        np.max(scores).__round__(3)) + ']', fontsize=10, loc='center', labelpad=6)

    # plot Likelyhood of X = {x0, x1} respect to x0
    likelyhood = np.array([np.exp(s) for s in scores])
    fig = plt.figure()
    plt.scatter(valdata[:, 0], likelyhood, alpha=1, lw=3)
    plt.xlim([np.min(valdata[:, 0]) - np.std(valdata[:, 0]), np.max(valdata[:, 0]) + np.std(valdata[:, 0])])
    plt.ylim([np.min(likelyhood) - np.std(likelyhood), np.max(likelyhood) + np.std(likelyhood)])
    plt.title(label='Likelyhood estimation', fontsize=8, loc='center')
    plt.suptitle(t='Likelyhood of features ' + features)
    plt.xlabel(xlabel=features + ' with support [' + str(np.min(valdata[:, 0]).__round__(3)) + ',' + str(
        np.max(valdata[:, 0]).__round__(3)) + ']', fontsize=8, loc='center', labelpad=3)
    plt.ylabel(ylabel='Likelyhood with support[ ' + str(np.min(likelyhood).__round__(3)) + ',' + str(
        np.max(likelyhood).__round__(3)) + ']', fontsize=10, loc='center', labelpad=6)

    # plot Likelyhood of X = {x0, x1} respect to pure index
    likelyhood = np.array([np.exp(s) for s in scores])
    fig = plt.figure()
    plt.plot(np.linspace(-5, 5, likelyhood.__len__()), likelyhood)
    plt.xlim(
        [-5 - np.std(np.linspace(-5, 5, likelyhood.__len__())), 5 + np.std(np.linspace(-5, 5, likelyhood.__len__()))])
    plt.ylim([np.min(likelyhood) - np.std(likelyhood), np.max(likelyhood) + np.std(likelyhood)])
    plt.title(label='Likelyhood estimation', fontsize=8, loc='center')
    plt.suptitle(t='Likelyhood of features ' + features)
    plt.xlabel(xlabel=features + 'Index with support [' + str(-5) + ',' + str(5) + ']', fontsize=8, loc='center',
               labelpad=3)
    plt.ylabel(ylabel='Likelyhood with support[ ' + str(np.min(likelyhood).__round__(3)) + ',' + str(
        np.max(likelyhood).__round__(3)) + ']', fontsize=10, loc='center', labelpad=6)

    snorm0 = np.linalg.norm(-scores[0])
    snorm1 = np.linalg.norm(-scores[1])
    snorm2 = np.linalg.norm(-scores[2])
    result_scores0 = -scores[0] / snorm0
    result_scores1 = -scores[1] / snorm1

    labels = [p > 0.04 for p in likelyhood]
    fpr, tpr, thresholds = roc_curve(y_true=labels, y_score=likelyhood)
    roc_auc = auc(fpr, tpr)
    fig = plt.figure()
    plt.title(f'ROC curve')
    plt.plot(fpr, tpr, 'b', label='AUC = %0.2f' % roc_auc)
    plt.legend(loc='lower right')
    plt.plot([0, 1], [0, 1], 'r--')
    plt.xlim([0, 1])
    plt.ylim([0, 1.1])
    plt.ylabel('True Positive Rate')
    plt.xlabel('False Positive Rate')
    fig = plt.figure()
    plt.scatter([[i for i in range(1000)] for j in range(2)], traindata, c='red')
    fig = plt.figure()
    plt.scatter([[i for i in range(1000)] for j in range(2)], testdata, c='blue')


# Estimate probability (best pdf estimation, pdf estimation, cdf estimations) and plot some charts
# estimate_probability(acc_x)
# estimate_probability(acc_y)
# estimate_probability(acc_z)


# Start DB Connection
client = MongoClient('its1mongodb', 27017)
database = client['Characterization_Dataset']
collection = database['4080_Old_2']
movement_documents = []


preprocessings = []
features = []
raw_features = []

for doc in collection.find({}):
    movement_documents.append(doc)

if movement_documents.__len__() <= 0:
    exit(1)

# Create two threads as follows
try:
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = []
        extraction_results = []
        for movement_doc in movement_documents:
            movement_data = movement_doc['Measures']
            acc_x = movement_data['Acc_x [g]']
            acc_y = movement_data['Acc_y [g]']
            acc_z = movement_data['Acc_z [g]']
            acc_x = acc_x[0:20]
            acc_y = acc_y[0:20]
            acc_z = acc_z[0:20]
            data = np.array([acc_x, acc_y, acc_z], dtype=float)
            signals = ['Acc_x', 'Acc_y', 'Acc_z']
            try:
                futures.append(executor.submit(Features_Extraction.extract, data, signals))
            except:
                print('Error: unable to start threads')
            break
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

        for extraction_result in extraction_results:
            preprocessings.extend(extraction_result[0])
            features.extend(extraction_result[1])
            raw_features.extend(extraction_result[2])
except:
    print('Error: unable to start feature extraction')





