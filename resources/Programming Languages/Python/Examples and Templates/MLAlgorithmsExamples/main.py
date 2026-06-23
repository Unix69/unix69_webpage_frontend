# This is a sample Python script.
import os
from datetime import datetime
from time import strptime

import pandas as pd
import numpy as np
import scipy
from pandas import DataFrame
from pandas.io.parsers import TextFileReader
from setuptools import glob
from sklearn.metrics import silhouette_score, silhouette_samples, homogeneity_score, fowlkes_mallows_score, \
    adjusted_mutual_info_score, adjusted_rand_score
from sklearn.mixture import GaussianMixture
from sklearn.model_selection import train_test_split
import pydot
from itertools import combinations
from sklearn.cluster import KMeans, SpectralClustering, AgglomerativeClustering, OPTICS, MeanShift, MiniBatchKMeans, \
    DBSCAN, Birch, AffinityPropagation
from sklearn.cluster import KMeans

from sklearn.preprocessing import StandardScaler

from sklearn.metrics.cluster import completeness_score




def Random_Forest_Regressor_Test(train_features, train_labels, test_features, test_labels, feature_names,
                                 n_estimators=1000, random_state=42, output=False, plot=False, show=False, title=None,
                                 suptitle=None, tree=False, importance=False):
    from sklearn.metrics import mean_squared_error
    from sklearn.metrics import mean_absolute_error
    from sklearn.metrics import mean_squared_log_error
    from sklearn.metrics import f1_score
    from sklearn.metrics import r2_score
    from sklearn.metrics import accuracy_score
    from sklearn.tree import export_graphviz
    from sklearn.metrics import precision_score
    from sklearn.metrics import d2_pinball_score
    from sklearn.metrics import d2_tweedie_score
    from sklearn.metrics import d2_absolute_error_score
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.metrics import jaccard_score

    rf = RandomForestRegressor(n_estimators=n_estimators, random_state=random_state)

    print('Train RF')
    # Train the model on training data
    rf.fit(X=train_features, y=train_labels)

    print('Predict RF')
    # Use the forest's predict method on the test data
    predictions = rf.predict(X=test_features)

    print('Errors and Scores on RF')
    # Calculate the absolute errors
    errors = abs(predictions - test_labels)

    # Calculate Scores and Errors
    # roc_auc_score = roc_auc_score(y_true=test_labels, y_pred=predictions)

    s_error = sum(pow(errors, 2))
    if output:
        print('Squared Error:', s_error)

    ms_error = mean_squared_error(y_true=test_labels, y_pred=predictions, squared=True)
    if output:
        print('Mean Squared Error:', ms_error)

    rms_error = mean_squared_error(y_true=test_labels, y_pred=predictions, squared=False)
    if output:
        print('Root Mean Squared Error:', rms_error)

    ma_error = mean_absolute_error(y_true=test_labels, y_pred=predictions)
    if output:
        print('Mean Absolute Error:', ma_error)

    if not (any(x < 0 for x in test_labels) or any(x < 0 for x in predictions)):
        msl_error = mean_squared_log_error(y_true=test_labels, y_pred=predictions, squared=True)
        if output:
            print('Mean Squared Log Error:', msl_error)

    if not (any(x < 0 for x in test_labels) or any(x < 0 for x in predictions)):
        rmsl_error = mean_squared_log_error(y_true=test_labels, y_pred=predictions, squared=False)
        if output:
            print('Root Mean Squared Log Error:', rmsl_error)

    r2_score = r2_score(y_true=test_labels, y_pred=predictions, force_finite=True)
    if output:
        print('R2 Score:', r2_score)

    if not any(isinstance(x, float) for x in test_labels):
        naccuracy_score = accuracy_score(y_true=test_labels, y_pred=predictions, normalize=True)
        if output:
            print('Normalized Accuracy Score:', naccuracy_score)

        accuracy_score = accuracy_score(y_true=test_labels, y_pred=predictions, normalize=False)
        if output:
            print('Accuracy Score:', accuracy_score)

        precision_score = precision_score(y_true=test_labels, y_pred=predictions)
        if output:
            print('Precision Score:', precision_score)

        f1_ma_score = f1_score(y_true=test_labels, y_pred=predictions, average='macro', zero_division=1)
        if output:
            print('Macro F1 Score:', f1_ma_score)

        f1_mi_score = f1_score(y_true=test_labels, y_pred=predictions, average='micro', zero_division=1)
        if output:
            print('Micro F1 Score:', f1_mi_score)

        f1_w_score = f1_score(y_true=test_labels, y_pred=predictions, average='weighted', zero_division=1)
        if output:
            print('Weighted F1 Score:', f1_w_score)

        jaccard_score = jaccard_score(y_true=test_labels, y_pred=predictions)
        if output:
            print('Jaccard Score:', jaccard_score)

    d2_absolute_score = d2_absolute_error_score(y_true=test_labels, y_pred=predictions)
    if output:
        print('D2 Absolute Score:', d2_absolute_score)
    d2_pinball_score = d2_pinball_score(y_true=test_labels, y_pred=predictions)
    if output:
        print('D2 Pinball Score:', d2_pinball_score)
    d2_tweedie_score = d2_tweedie_score(y_true=test_labels, y_pred=predictions)
    if output:
        print('D2 Tweedie Score:', d2_tweedie_score)

    if plot:
        Histogram_Plot(data=[ms_error, rms_error, ma_error],
                   labels=['msquared', 'root msquared', 'mean abs'],
                   title='Errors on RF Predictions', xlabel='Index', ylabel='Error')

        Histogram_Plot(data=[r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score],
                   labels=['r2', 'd2 absolute', 'd2 pinball', 'd2 tweedie'],
                   title='Scores on RF Predictions', xlabel='Index', ylabel='Score')

    if tree:
        tree = rf.estimators_[5]  # Import tools needed for visualization
        tree = rf.estimators_[5]  # Export the image to a dot file
        export_graphviz(tree, out_file='tree.dot', feature_names=feature_names, rounded=True,
                    precision=1)
        # Use dot file to create a graph
        (graph,) = pydot.graph_from_dot_file('tree.dot')  # Write graph to a png file
        graph.write_png('tree.png')

    if importance:
        # Get numerical feature importances
        importances = list(rf.feature_importances_)  # List of tuples with variable and importance
        feature_importances = [(feature, round(importance, 2)) for feature, importance in zip(feature_names, importances)]
        feature_importances = sorted(feature_importances, key=lambda x: x[1], reverse=True)

        if output:
            [print('Variable: {:20} Importance: {}'.format(*pair)) for pair in feature_importances]

        if plot:
            plt.figure()
            plt.style.use('fivethirtyeight')  # list of x locations for plotting
            x_values = list(range(len(importances)))  # Make a bar chart
            plt.bar(x_values, importances, orientation='vertical')  # Tick labels for x axis
            plt.xticks(x_values, feature_names, rotation='horizontal')  # Axis labels and title
            if title:
                plt.title(title + ' - Variable Importances')
            else:
                plt.title('Variable Importances')
            if suptitle:
                plt.suptitle(suptitle)
            plt.ylabel('Importance', fontsize=0.8, loc='center', labelpad=3)
            plt.xlabel('Variable', fontsize=0.8, loc='center', labelpad=3)
            plt.ylim([0, 1])

            if show:
                plt.show()

    return r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error


def Feature_Combination_Plots(features, feature_names, label_colors, title = 'Clustering', fX = None, fY = None, show = False):
    if fX >= 0 and fY >= 0 and isinstance(fX, int) and isinstance(fY, int) \
            and 0 <= fX < len(features) and 0 <= fY < len(features):
        feature_scatter_combination = [(fX, fY)]
    else:
        feature_scatter_combination = combinations([i for i in range(len(features[0, :]))], 2)

    # Plotting combined/single features
    for i, j in list(feature_scatter_combination):
        fs1 = list(features[:, i])
        fs2 = list(features[:, j])
        fig = plt.figure()
        plt.scatter(x=fs1, y=fs2, c=label_colors, alpha=1, lw=3)
        plt.title(title, fontsize=8, loc='center')
        plt.suptitle('Features (%s, %s)' % (feature_names[i], feature_names[j]))
        plt.xlabel(xlabel=feature_names[i], fontsize=8, loc='center', labelpad=3)
        plt.ylabel(ylabel=feature_names[j], fontsize=8, loc='center', labelpad=3)
        plt.xlim([np.min(fs1), np.max(fs1)])
        plt.ylim([np.min(fs2), np.max(fs2)])

    if show:
        plt.show()

def Histogram_Plot(data, labels = None, title = None, xlabel = None, ylabel = None, ylimit = None, show = False):
    plt.figure()
    plt.style.use('fivethirtyeight')  # list of x locations for plotting
    bar = list(range(len(data)))  # Make a bar chart
    plt.bar(bar, data, orientation='vertical')  # Tick labels for x axis
    plt.xticks(bar, labels, rotation='horizontal')  # Axis labels and title
    plt.title(title)
    plt.ylabel(ylabel, fontsize=0.8, loc='center', labelpad=3)
    plt.xlabel(xlabel, fontsize=0.8, loc='center', labelpad=3)
    plt.ylim(ylimit)
    if show:
        plt.show()


def Feature_Combination_Plots_3d(features, feature_names, label_colors = 'blue', fX = None, fY = None, fZ = None, show = False):
    if fX and fY and fZ and isinstance(fX, int) and isinstance(fY, int) and isinstance(fZ, int) \
            and 0 <= fX < len(features) and 0 <= fY < len(features) and 0 <= fZ < len(features):
        feature_scatter_combination = [(fX, fY, fZ)]
    else:
        feature_scatter_combination = combinations([i for i in range(len(features[0, :]))], 3)

    # 3d Plotting combined/single features
    for i, j, k in list(feature_scatter_combination):
        # Plotting 3d features
        fs1 = features[:, i]
        fs2 = features[:, j]
        fs3 = features[:, k]
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')
        ax.scatter(fs1, fs2, fs3, c=label_colors, marker='o')
        plt.title('Scatter Plot', fontsize=8, loc='center')
        plt.suptitle('Scatter Plot (%s, %s, %s)' % (feature_names[i], feature_names[j], feature_names[k]))
        ax.set_xlabel(feature_names[0], fontsize=8, loc='center', labelpad=3)
        ax.set_ylabel(feature_names[1], fontsize=8, loc='center', labelpad=3)
        ax.set_zlabel(feature_names[2], fontsize=8, loc='center', labelpad=3)
        ax.set_xlim([np.min(fs1), np.max(fs1)])
        ax.set_ylim([np.min(fs2), np.max(fs2)])
        ax.set_zlim([np.min(fs3), np.max(fs3)])
    if show:
        plt.show()

def Preprocess_Probe_Data(data_path, unsupervised_preproc = True, label_name = None):
    probe_cyc_counter = {}
    probe_counts = []
    labels = []
    label_colors = []

    color_prob_cyc_count_bound = {1000000: 'blue', 2000000: 'red', 3000000: 'green', 4000000: 'black',
                                  5000000: 'yellow',
                                  6000000: 'pink',
                                  7000000: 'violet', 8000000: 'gray'}

    # Read Data from csv and assign column names
    data = pd.read_csv(filepath_or_buffer=data_path, sep=' ', names=['Date', 'Time', 'MeasureType', 'Probe', 'Resistance'])

    # Format and Transform Data by columns
    data['Probe'] = [int(str(data['Probe'].iloc[i]).replace('Probe', '')) for i in range(0, len(data), 1)]
    data['Timestamp'] = [int(datetime.
                             strptime(str(data['Date'].iloc[i]) + ' ' + str(data['Time'].iloc[i]), '%d.%B.%y %H.%M')
                             .timestamp())
                         for i in range(0, len(data), 1)]

    # Extract additional cycle count feature
    for i in range(0, len(data), 1):
        probe = data.iloc[i]['Probe']
        if not (probe in probe_cyc_counter):
            probe_cyc_counter[probe] = 0
        else:
            probe_cyc_counter[probe] += 1000
        probe_counts.append(probe_cyc_counter[probe])

    data['Cycle_Probe_Count'] = probe_counts
    print('The shape of our data is:', data.shape)


    if not unsupervised_preproc:
        # Extract label by dividing cycle count feature into uniform ranges given by map color_prob_cyc_count_bound
        for probe_count in probe_counts:
            for prob_cyc_count, color in zip(color_prob_cyc_count_bound.keys(), color_prob_cyc_count_bound.values()):
                if probe_count <= prob_cyc_count:
                    label_colors.append(color)
                    break
        # extract labels from data and convert to numpy array
        labels = np.array(data[label_name])
        # Drop label column from data columns
        data = data.drop(label_name, axis=1)

    # Drop data columns
    data = data.drop('MeasureType', axis=1)
    data = data.drop('Date', axis=1)
    data = data.drop('Time', axis=1)

    print('The shape of our data is:', data.shape)

    # The remained data are features
    features = data
    # Saving feature names for later use
    feature_names = list(features.columns)
    # Convert to numpy array
    features = np.array(features)

    # Normalize the data
    features = StandardScaler().fit_transform(features)

    return features, feature_names, labels, label_colors

def Clustering_Silhouette_Analysis(ncluster_list, model_initializer, features, feature_names):
    sil_preds_scores = []
    sil_preds_sample_scores = []
    features = features.copy(order='C')
    for i, k in zip(range(len(ncluster_list)), ncluster_list):
        model = model_initializer(n_clusters=k)
        labels_pred = model.fit_predict(features)
        print(labels_pred)
        sil_preds_score = silhouette_score(X=features, labels=labels_pred)
        sil_preds_sample_scores.append(silhouette_samples(X=features, labels=labels_pred))
        sil_preds_scores.append(sil_preds_score)
        print('-----------------------------------')
        print('Predicted Labels:', labels_pred)
        print('Clusters K:', k)
        print('Predicted Labels Silhouette Score:', sil_preds_score)
        print('Predicted Labels Silhouette Sample Score:', sil_preds_sample_scores[i])
        print('-----------------------------------')
    return sil_preds_scores, sil_preds_sample_scores

def Clustering_Scores(labels_true, labels_pred):
    hom_preds_score = homogeneity_score(labels_true=labels_true, labels_pred=labels_pred)
    comp_preds_score = completeness_score(labels_true=labels_true, labels_pred=labels_pred)
    fowlkes_preds_score = fowlkes_mallows_score(labels_true=labels_true, labels_pred=labels_pred)
    adjusted_preds_score = adjusted_rand_score(labels_true=labels_true, labels_pred=labels_pred)
    adjusted_mutual_info_preds_score = adjusted_mutual_info_score(labels_true=labels_true, labels_pred=labels_pred)
    print('-----------------------------------')
    print('Predicted Labels:', labels_pred)
    print('True Labels:', labels_true)
    print('Predicted Labels Completeness Score:', comp_preds_score)
    print('Predicted Labels Homogeneity Score:', hom_preds_score)
    print('Predicted Labels Fowlkes Score:', fowlkes_preds_score)
    print('Predicted Labels Adjustend Rand Index:', adjusted_preds_score)
    print('Predicted Labels Adjustend Mutual Info Score:', adjusted_mutual_info_preds_score)
    print('-----------------------------------')
    return hom_preds_score, comp_preds_score, fowlkes_preds_score, adjusted_preds_score, adjusted_mutual_info_preds_score


def Clustering_Overall_Model_Silhouette_Analysis(cluster_range, features, feature_names):
    model_silhouette_analysis_map = {}
    list_k = list(cluster_range)

    # https://www.tutorialspoint.com/scikit_learn/scikit_learn_clustering_performance_evaluation.htm
    model_silhouette_analysis_map['birch'] = Clustering_Silhouette_Analysis(
        ncluster_list=list_k, model_initializer=Birch, features=features, feature_names=feature_names)

    model_silhouette_analysis_map['mbkmeans'] = Clustering_Silhouette_Analysis(
        ncluster_list=list_k, model_initializer=MiniBatchKMeans, features=features, feature_names=feature_names)

    model_silhouette_analysis_map['kmeans'] = Clustering_Silhouette_Analysis(
        ncluster_list=list_k, model_initializer=KMeans, features=features, feature_names=feature_names)

    model_silhouette_analysis_map['spect'] = Clustering_Silhouette_Analysis(
        ncluster_list=list_k, model_initializer=SpectralClustering, features=features, feature_names=feature_names)

    model_silhouette_analysis_map['agg'] = Clustering_Silhouette_Analysis(
        ncluster_list=list_k, model_initializer=AgglomerativeClustering, features=features, feature_names=feature_names)

    return model_silhouette_analysis_map

def Clustering_Overall_Model_Test(ncluster, features, feature_names, color_map, plotted_fx = None, plotted_fy = None):

    # https://machinelearningmastery.com/clustering-algorithms-with-python/
    for n in ncluster:
        # define the model
        gm = GaussianMixture(n_components=n)
        # fit the model
        gm_labels_pred = gm.fit_predict(features)
        label_colors = [color_map[label] for label in gm_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                              label_colors=label_colors,  title='Gaussian Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        dbscan = DBSCAN(eps=0.8, min_samples=n)
        # fit the model
        dbscan_labels_pred = dbscan.fit_predict(features)
        # label_colors = [color_map[label] for label in dbscan_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors, title='DBSCAN Clustering',  fX=plotted_fx, fY=plotted_fy)

        # define the model
        optics = OPTICS(eps=0.8, min_samples=n)
        # fit the model
        optics_labels_pred = optics.fit_predict(features)
        optics_labels_pred = optics_labels_pred + 1
        # label_colors = [color_map[label] for label in optics_labels_pred if label > 0]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=optics_labels_pred,  title='Optics Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        ms = MeanShift()
        # fit the model
        ms_labels_pred = ms.fit_predict(features)
        label_colors = [color_map[label] for label in ms_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors,  title='Mean Shift Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        ap = AffinityPropagation(damping=0.9)
        # fit the model
        ap_labels_pred = ap.fit_predict(features)
        label_colors = [color_map[label] for label in ap_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors,  title='Affinity Propagation Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        # birch = Birch(n_clusters=n)
        # fit the model
        # birch_labels_pred = birch.fit_predict(features)
        # label_colors = [color_map[label] for label in birch_labels_pred]
        # Feature_Combination_Plots(features=features, feature_names=feature_names,
        #                         label_colors=label_colors, fX=plotted_fx, fY=plotted_fy)

        # define the model
        mbkmeans = MiniBatchKMeans(n_clusters=n)
        # fit the model
        mbkmeans_labels_pred = mbkmeans.fit_predict(features)
        label_colors = [color_map[label] for label in mbkmeans_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors,  title='Mini Batch KMeans Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        kmeans = KMeans(n_clusters=n)
        # fit the model
        kmeans_labels_pred = kmeans.fit_predict(features)
        label_colors = [color_map[label] for label in kmeans_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors,  title='KMeans Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        spect = SpectralClustering(n_clusters=n)
        # fit the model
        spect_labels_pred = spect.fit_predict(features)
        label_colors = [color_map[label] for label in spect_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors, title='Spectral Clustering', fX=plotted_fx, fY=plotted_fy)

        # define the model
        agg = AgglomerativeClustering(n_clusters=n)
        # fit the model
        agg_labels_pred = agg.fit_predict(features)
        label_colors = [color_map[label] for label in agg_labels_pred]
        Feature_Combination_Plots(features=features, feature_names=feature_names,
                                  label_colors=label_colors,  title='Agglomerative Clustering', fX=plotted_fx, fY=plotted_fy)

        plt.show()

def Clustering_Overall_Model_NCluster_Elbow_Analysis(features, nclusters_range):
    sse = []
    for k in nclusters_range:
        km = KMeans(n_clusters=k)
        km.fit(features)
        sse.append(km.inertia_)
    # Plot sse against k
    plt.figure(figsize=(6, 6))
    plt.plot(nclusters_range, sse, '-o')
    plt.title('N Clusters / SSE - KMeans')
    plt.suptitle('Elbow method')
    plt.xlabel('K')
    plt.ylabel('SSE')

    sse.clear()
    for k in nclusters_range:
        mbkm = MiniBatchKMeans(n_clusters=k)
        mbkm.fit(features)
        sse.append(mbkm.inertia_)
    # Plot sse against k
    plt.figure(figsize=(6, 6))
    plt.plot(nclusters_range, sse, '-o')
    plt.title('N Clusters / SSE - Mini Batch KMeans')
    plt.suptitle('Elbow method')
    plt.xlabel('K')
    plt.ylabel('SSE')
    plt.show()

def Preprocess_Unsupervised_Digital_Rotary_Tree_Data(data_path, standardize=False):
    # Read Data from mat and assign column names
    import os
    speed_frame = DataFrame()
    angle_frame = DataFrame()

    speed_data_path = os.path.join(data_path, "Speed")
    angle_data_path = os.path.join(data_path, "Angle")

    speed_files = os.listdir(speed_data_path)
    speed_files.sort()

    angle_files = os.listdir(angle_data_path)
    angle_files.sort()

    data = [0 for i in range(16)]

    for speed_file, angle_file in zip(speed_files, angle_files):
        if speed_file.endswith(".csv") and speed_file.startswith("Speed_Variance_Attempt_"):
            speed_filepath = os.path.join(speed_data_path, speed_file)
            try:
                speed_frame = pd.read_csv(speed_filepath, names=['Time', 'Speed'])
                print(speed_file)
            except pd.errors.ParserError as ppe:
                print('Parse '+speed_file+' occurred ' + str(ppe.__class__))


        if angle_file.endswith(".csv") and angle_file.startswith("Angle_Variance_Attempt_"):
            angle_filepath = os.path.join(angle_data_path, angle_file)
            try:
                angle_frame = pd.read_csv(angle_filepath, names=['Time', 'Angle'])
                print(angle_file)
            except pd.errors.ParserError as ppe:
                print('Parse ' + angle_file + ' occurred ' + str(ppe.__class__))


        suffix = speed_file.split('_')
        suffix = suffix[len(suffix) - 1].split('.')
        attempt = int(suffix[0])


        speed_frame = speed_frame.drop(columns='Time')
        pdata = pd.concat(objs=(angle_frame, speed_frame), axis=1)
        pdata = pdata.transpose().to_numpy().flatten()
        data[attempt-1] = pdata

    speed_features_names = ['Speed' + str(i) for i in range(50001)]
    angle_features_names = ['Angle' + str(i) for i in range(50001)]
    time_features_names = ['Time' + str(i) for i in range(50001)]
    feature_names = time_features_names + angle_features_names + speed_features_names


    dataframe = DataFrame(data=data, columns=feature_names)
    print('The shape of our data is:', dataframe.shape)

    # Convert to numpy array
    features = dataframe.to_numpy()

    # Normalize the data if standardize enabled
    if standardize:
        features = StandardScaler().fit_transform(features)

    return features, feature_names




def Preprocess_Unsupervised_MultipleBearingWithFail_Data(data_path, standardize=False):
    # Read Data from mat and assign column names
    import os

    acc_index = 0
    data = DataFrame()
    acc_files = os.listdir(data_path)
    acc_file_map = {}
    for acc_file in acc_files:
        acc_file_splitted = acc_file.split(sep='.')
        try:
            acc_file_intdate = int(datetime.strptime(str(acc_file_splitted[0]) + '.' + str(acc_file_splitted[1]) + '.' +
                                              str(acc_file_splitted[2]) + ' ' + str(acc_file_splitted[3]) + '.' +
                                              str(acc_file_splitted[4]), '%Y.%m.%d %H.%M')
                                 .timestamp())
        except Exception as e:
            print(str(acc_file_splitted))
        acc_file_map[acc_file_intdate] = acc_file

    acc_files = acc_file_map.values()
    acc_files = acc_file_map.values()
    i = 0
    acc_feature_names = []
    for i in range(0, 20479, 1):
        acc_feature_names.extend(['acc_x_' + str(i), 'acc_y_'+ str(i), 'acc_x_'+ str(i+1), 'acc_y_'+ str(i+1),
                             'acc_x_'+ str(i+2), 'acc_y_'+ str(i+2), 'acc_x_'+ str(i+3), 'acc_y_'+ str(i+3)])
    for acc_file in acc_files:
        if acc_file.__contains__("."):
            acc_filepath = os.path.join(data_path, acc_file)
            try:
                acc_frame = pd.read_csv(acc_filepath, index_col=None, header=0, sep='\t',
                           names=None, dtype=float)
                acc_aframe = np.array(acc_frame.to_numpy().tolist(), dtype=float).reshape(1, 8*20479)
                if acc_index == 0:
                    data = np.array(acc_aframe.tolist(), dtype=float)
                else:
                    # data = np.concatenate((data, acc_aframe), axis=0)
                    data = np.vstack((data, acc_aframe))
                acc_index += 1
                print(acc_file)
            except pd.errors.ParserError as ppe:
                print('Parse '+acc_file+' occurred ' + str(ppe.__class__))
        i += 1

    data_frame = pd.DataFrame(data, columns=acc_feature_names)
    time_acc_feature = [int(i) for i in range(len(data[0]))]
    time_acc_features = [time_acc_feature for j in range(len(data))]
    time_acc_names = ['time_'+str(j) for j in range(len(data[0]))]
    time_acc_frame = pd.DataFrame(time_acc_features, columns=time_acc_names)
    data_frame = pd.concat(objs=(data_frame, time_acc_frame), axis=1)


    print('The shape of our train data is:', data.shape)

    feature_names = list(data_frame.columns)
    features = data_frame.to_numpy()

    # Normalize the data if standardize enabled
    if standardize:
        features = StandardScaler().fit_transform(features)


    return features, feature_names








def Preprocess_Unsupervised_MultipleBearing_Data(data_path, standardize=False):
    # Read Data from mat and assign column names
    import os
    data = DataFrame()

    acc_files = os.listdir(data_path)
    for acc_file in acc_files:
        if acc_file.endswith(".csv") and acc_file.startswith("acc_"):
            acc_filepath = os.path.join(data_path, acc_file)
            try:
                suffix = acc_file.split('_')
                suffix = suffix[len(suffix) - 1].split('.')
                acc_index = int(suffix[0])

                acc_feature_names = ['hour', 'minutes', 'second', 'seg' + str(acc_index), 'acc_x' + str(acc_index), 'acc_y' + str(acc_index)]
                acc_frame = pd.read_csv(acc_filepath, index_col=None, header=0, sep=',',
                           names=acc_feature_names)
                acc_frame = acc_frame.drop(columns='hour', axis=1)
                acc_frame = acc_frame.drop(columns='minutes', axis=1)
                acc_frame = acc_frame.drop(columns='second', axis=1)

                data = pd.concat(objs=(data, acc_frame), axis=1)
                print(acc_file)
            except pd.errors.ParserError as ppe:
                print('Parse '+acc_file+' occurred ' + str(ppe.__class__))

    data['time'] = [int(i) for i in range(len(data))]
    print('The shape of our train data is:', data.shape)

    feature_names = list(data.columns)
    features = data.to_numpy()

    # Normalize the data if standardize enabled
    if standardize:
        features = StandardScaler().fit_transform(features)


    return features, feature_names


def Preprocess_Unsupervised_SingleBearing_Data(data_path, standardize = False):
    # Read Data from csv and assign column names
    acc_feature_names = ['hour', 'minutes', 'second', 'seg', 'acc_x', 'acc_y']

    feature_names = acc_feature_names
    data = pd.read_csv(data_path, index_col=None, header=0, sep=',',
                           names=feature_names)

    print('The shape of our data is:', data.shape)

    data = data.drop('hour', axis=1)
    data = data.drop('minutes', axis=1)
    data = data.drop('second', axis=1)

    feature_names = data.columns

    # The remained data are features
    features = data
    # Saving feature names for later use
    feature_names = list(features.columns)
    # Convert to numpy array
    features = np.array(features)

    # Normalize the data if standardize enabled
    if standardize:
        features = StandardScaler().fit_transform(features)

    return features, feature_names


def RandomForestRegressor_Score_Degradation_Analysis(features, feature_names, rf_random_state = 42,
                                                     rf_nestimators = 1000, predicted_nfeature=0,
                                                     training_nsamples_step=1, test_nsamples_step=2, standardize=False):
    step = training_nsamples_step
    for i in range(step, len(features), step):
        train_features = features[:i, :2]
        train_labels = features[:i, 2]
        r2_scores = []
        d2_absolute_scores = []
        d2_pinball_scores = []
        d2_tweedie_scores = []
        ms_errors = []
        rms_errors = []
        ma_errors = []
        tstep = test_nsamples_step
        for j in range(i, len(features[i:]), tstep):
            test_features = features[j:j + tstep, :2]
            test_labels = features[j:j + tstep, 2]
            r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error = \
                Random_Forest_Regressor_Test(train_features=train_features,
                                             train_labels=train_labels,
                                             feature_names=feature_names[0:2],
                                             test_features=test_features,
                                             test_labels=test_labels, plot=False)
            r2_scores.append(r2_score)
            d2_absolute_scores.append(d2_absolute_score)
            d2_tweedie_scores.append(d2_tweedie_score)
            d2_pinball_scores.append(d2_pinball_score)
            ms_errors.append(ms_error)
            rms_errors.append(rms_error)
            ma_errors.append(ma_error)

        scores = [r2_scores, d2_absolute_scores, d2_tweedie_scores, d2_pinball_scores]
        scores_names = {0: 'R2', 1: 'D2 Absolute', 2: 'D2 Pinball', 3: 'D2 Tweedie'}
        fig, ax = plt.subplots(len(scores), sharex='col')
        for i, sscores in zip(range(len(scores)), scores):
            ax[i].plot(np.arange(0, len(sscores)), sscores, c=color_map[i])
            ax[i].set_title(str(scores_names[i]) + ' scores over component life time', pad=3)
            ax[i].set_ylabel(str(scores_names[i]) + ' score', labelpad=3)
        errors = [ms_errors, ma_errors, rms_errors]
        error_names = {0: 'Mean Squared', 1: 'Mean Absolute', 2: 'Root Mean Squared'}
        fig, ax = plt.subplots(len(errors), sharex='col')
        for i, serrors in zip(range(len(errors)), errors):
            ax[i].plot(np.arange(0, len(serrors)), serrors, c=color_map[i])
            ax[i].set_title(str(error_names[i]) + ' errors over component life time', pad=3)
            ax[i].set_ylabel(str(error_names[i]) + ' error', labelpad=3)
        plt.show()






color_map = { 0: 'blue', 1: 'red', 2: 'green', 3: 'yellow', 4: 'pink', 5: 'gray', 6: 'black', 7: 'violet',
              8: 'lightblue', 9: 'darkgray', 10: 'orange', 11: 'blue', 12: 'darkred', 13: 'cyan', 14: 'fuchsia',
              15: 'olive', 16: 'deeppink', 17: 'purple', 18: 'royalblue', 19: 'lime', 20: 'orange', 21: 'navy'}

cluster_range = list(range(2, 11))


# features, feature_names, labels, label_colors = Preprocess_Probe_Data(data_path='./Probe_Data.log'
#                                                                      , unsupervised_preproc=True)
#



#Clustering_Overall_Model_Test(ncluster=cluster_range, features=features, feature_names=feature_names,
#                             color_map=color_map, plotted_fx=4, plotted_fy=5)



def RandomForestRegressor_MultipleBearning_Score_Degradation_Analysis(features, feature_names, rf_random_state = 42, rf_nestimators = 1000, predicted_nfeature=2, single_test=True, col_nsample=10, max_train_test_split_index=10, train_nsamples_step=2, test_nsamples_step=2, plot=False, show=False):

    for i in range(train_nsamples_step, max_train_test_split_index, train_nsamples_step):
        print('Train RF on training samples [0, ' + str(i) + ']')
        train_features = np.concatenate((features[:i, :predicted_nfeature-1], features[:i, predicted_nfeature:]), axis=1)
        train_labels = features[:i, predicted_nfeature-1]
        r2_scores = []
        d2_absolute_scores = []
        d2_pinball_scores = []
        d2_tweedie_scores = []
        ms_errors = []
        rms_errors = []
        ma_errors = []
        r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error = \
            Random_Forest_Regressor_Test(train_features=train_features,
                                         train_labels=train_labels,
                                         feature_names=feature_names[:predicted_nfeature-1] + feature_names[predicted_nfeature:],
                                         test_features=train_features,
                                         test_labels=train_labels, plot=False, n_estimators=rf_nestimators,
                                         random_state=rf_random_state)
        r2_scores.append(r2_score)
        d2_absolute_scores.append(d2_absolute_score)
        d2_tweedie_scores.append(d2_tweedie_score)
        d2_pinball_scores.append(d2_pinball_score)
        ms_errors.append(ms_error)
        rms_errors.append(rms_error)
        ma_errors.append(ma_error)
        print('Scores on training samples [' + str(0) + ', ' + str(i) + ']')
        print('\tR2 = ' + str(r2_score))
        print('\tD2 tweedie = ' + str(d2_tweedie_score))
        print('\tD2 pinball = ' + str(d2_pinball_score))
        print('\tD2 absolute = ' + str(d2_absolute_score))
        print('Errors on training samples [' + str(0) + ', ' + str(i) + ']')
        print('\tMean Squared = ' + str(ms_error))
        print('\tMean Absolute = ' + str(ma_error))
        print('\tRoot Mean Squared = ' + str(rms_error))
        tstep = test_nsamples_step
        toTest = 0
        for fromTest in range(i, len(features[0:]), tstep):
            if fromTest+tstep > len(features[0:]):
                toTest = len(features[0:])
            else:
                toTest = fromTest + tstep

            print('Test RF on samples ['+str(fromTest)+', ' + str(toTest) + ']')
            test_features = np.concatenate((features[fromTest:toTest, :predicted_nfeature - 1],
                                            features[fromTest:toTest,
                                            predicted_nfeature:]),
                                           axis=1)
            test_labels = features[fromTest:toTest, predicted_nfeature - 1]
            r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error = \
                Random_Forest_Regressor_Test(train_features=train_features,
                                             train_labels=train_labels,
                                             feature_names=feature_names[:predicted_nfeature - 1] +
                                                           feature_names[predicted_nfeature:],
                                             test_features=test_features,
                                             test_labels=test_labels, plot=False)
            r2_scores.append(r2_score)
            d2_absolute_scores.append(d2_absolute_score)
            d2_tweedie_scores.append(d2_tweedie_score)
            d2_pinball_scores.append(d2_pinball_score)
            ms_errors.append(ms_error)
            rms_errors.append(rms_error)
            ma_errors.append(ma_error)
            print('Scores on test samples [' + str(fromTest) + ', ' + str(toTest) + ']')
            print('\tR2 = ' + str(r2_score))
            print('\tD2 tweedie = ' + str(d2_tweedie_score))
            print('\tD2 pinball = ' + str(d2_pinball_score))
            print('\tD2 absolute = ' + str(d2_absolute_score))
            print('Errors on test samples [' + str(fromTest) + ', ' + str(toTest) + ']')
            print('\tMean Squared = ' + str(ms_error))
            print('\tMean Absolute = ' + str(ma_error))
            print('\tRoot Mean Squared = ' + str(rms_error))
        print('Scores on whole test samples')
        print('\tR2 = ' + str(r2_scores))
        print('\tD2 tweedie = ' + str(d2_tweedie_scores))
        print('\tD2 pinball = ' + str(d2_pinball_scores))
        print('\tD2 absolute = ' + str(d2_absolute_scores))
        print('Errors on whole test samples')
        print('\tMean Squared = ' + str(ms_errors))
        print('\tMean Absolute = ' + str(ma_errors))
        print('\tRoot Mean Squared = ' + str(rms_errors))
        if single_test:
            return r2_scores, d2_absolute_scores, d2_tweedie_score, d2_pinball_scores, ms_error, ma_error, rms_error

        if plot:
            scores = [r2_scores, d2_absolute_scores, d2_tweedie_scores, d2_pinball_scores]
            scores_names = {0: 'R2', 1: 'D2 Absolute', 2: 'D2 Pinball', 3: 'D2 Tweedie'}
            fig, ax = plt.subplots(len(scores), sharex='col')
            for i, sscores in zip(range(len(scores)), scores):
                ax[i].plot(np.arange(0, len(sscores)), sscores, c=color_map[i])
                ax[i].set_title(label=str(scores_names[i]) + ' scores over component life time', pad=3)
                ax[i].set_ylabel(ylabel=str(scores_names[i]) + ' score', labelpad=3)
            errors = [ms_errors, ma_errors, rms_errors]
            error_names = {0: 'Mean Squared', 1: 'Mean Absolute', 2: 'Root Mean Squared'}
            fig, ax = plt.subplots(len(errors), sharex='col')
            for i, serrors in zip(range(len(errors)), errors):
                ax[i].plot(np.arange(0, len(serrors)), serrors, c=color_map[i])
                ax[i].set_title(label=str(error_names[i]) + ' errors over component life time', pad=3)
                ax[i].set_ylabel(ylabel=str(error_names[i]) + ' error', labelpad=3)
            if show:
                plt.show()

        return r2_scores, d2_absolute_scores, d2_tweedie_score, d2_pinball_scores, ms_error, ma_error, rms_error


def RandomForestRegressor_DigitalTwin_Score_Degradation_Analysis(data_path, rf_random_state = 42, rf_nestimators = 1000, predicted_nfeature=125003, training_nsamples_step=3, test_nsamples_step=2):
    features, feature_names = Preprocess_Unsupervised_Digital_Rotary_Tree_Data(data_path=data_path,
                                    standardize=True)
    features = np.delete(features, [0], axis=0)
    step = training_nsamples_step
    for i in range(step, len(features), step):
        print('Train RF on training samples [0, ' + str(i) + ']')
        train_features = np.concatenate((features[:i, :predicted_nfeature-1], features[:i, predicted_nfeature:]), axis=1)
        train_labels = features[:i, predicted_nfeature-1]
        r2_scores = []
        d2_absolute_scores = []
        d2_pinball_scores = []
        d2_tweedie_scores = []
        ms_errors = []
        rms_errors = []
        ma_errors = []
        r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error = \
            Random_Forest_Regressor_Test(train_features=train_features,
                                         train_labels=train_labels,
                                         feature_names=feature_names[:predicted_nfeature-1] + feature_names[predicted_nfeature:],
                                         test_features=train_features,
                                         test_labels=train_labels, plot=False, n_estimators=rf_nestimators,
                                         random_state=rf_random_state)
        r2_scores.append(r2_score)
        d2_absolute_scores.append(d2_absolute_score)
        d2_tweedie_scores.append(d2_tweedie_score)
        d2_pinball_scores.append(d2_pinball_score)
        ms_errors.append(ms_error)
        rms_errors.append(rms_error)
        ma_errors.append(ma_error)
        print('Scores on training samples [' + str(i) + ', ' + str(i + step) + ']')
        print('\tR2 = ' + str(r2_score))
        print('\tD2 tweedie = ' + str(d2_tweedie_score))
        print('\tD2 pinball = ' + str(d2_pinball_score))
        print('\tD2 absolute = ' + str(d2_absolute_score))
        print('Errors on training samples [' + str(i) + ', ' + str(i + step) + ']')
        print('\tMean Squared = ' + str(ms_error))
        print('\tMean Absolute = ' + str(ma_error))
        print('\tRoot Mean Squared = ' + str(rms_error))
        tstep = test_nsamples_step
        toIndex = 0
        for fromIndex in range(i, len(features), tstep):
            if fromIndex+tstep > len(features):
                toIndex = len(features)
            else:
                toIndex = fromIndex + tstep

            print('Test RF on samples ['+str(fromIndex)+', ' + str(toIndex) + ']')
            test_features = np.concatenate((features[fromIndex:toIndex, :predicted_nfeature - 1],
                                            features[fromIndex:toIndex,
                                            predicted_nfeature:]),
                                           axis=1)
            test_labels = features[fromIndex:toIndex, predicted_nfeature - 1]
            r2_score, d2_absolute_score, d2_pinball_score, d2_tweedie_score, ms_error, rms_error, ma_error = \
                Random_Forest_Regressor_Test(train_features=train_features,
                                             train_labels=train_labels,
                                             feature_names=feature_names[:predicted_nfeature - 1] +
                                                           feature_names[predicted_nfeature:],
                                             test_features=test_features,
                                             test_labels=test_labels, plot=False)
            r2_scores.append(r2_score)
            d2_absolute_scores.append(d2_absolute_score)
            d2_tweedie_scores.append(d2_tweedie_score)
            d2_pinball_scores.append(d2_pinball_score)
            ms_errors.append(ms_error)
            rms_errors.append(rms_error)
            ma_errors.append(ma_error)
            print('Scores on test samples [' + str(fromIndex) + ', ' + str(toIndex) + ']')
            print('\tR2 = ' + str(r2_score))
            print('\tD2 tweedie = ' + str(d2_tweedie_score))
            print('\tD2 pinball = ' + str(d2_pinball_score))
            print('\tD2 absolute = ' + str(d2_absolute_score))
            print('Errors on test samples [' + str(fromIndex) + ', ' + str(toIndex) + ']')
            print('\tMean Squared = ' + str(ms_error))
            print('\tMean Absolute = ' + str(ma_error))
            print('\tRoot Mean Squared = ' + str(rms_error))

        print('Scores on whole test samples')
        print('\tR2 = ' + str(r2_scores))
        print('\tD2 tweedie = ' + str(d2_tweedie_scores))
        print('\tD2 pinball = ' + str(d2_pinball_scores))
        print('\tD2 absolute = ' + str(d2_absolute_scores))
        print('Errors on whole test samples')
        print('\tMean Squared = ' + str(ms_errors))
        print('\tMean Absolute = ' + str(ma_errors))
        print('\tRoot Mean Squared = ' + str(rms_errors))

        scores = [r2_scores, d2_absolute_scores, d2_tweedie_scores, d2_pinball_scores]
        scores_names = {0: 'R2', 1: 'D2 Absolute', 2: 'D2 Pinball', 3: 'D2 Tweedie'}
        fig, ax = plt.subplots(len(scores), sharex='col')
        for i, sscores in zip(range(len(scores)), scores):
            ax[i].plot(np.arange(0, len(sscores)), sscores, c=color_map[i])
            ax[i].set_title(label=str(scores_names[i]) + ' scores over component life time', pad=3)
            ax[i].set_ylabel(ylabel=str(scores_names[i]) + ' score', labelpad=3)
        errors = [ms_errors, ma_errors, rms_errors]
        error_names = {0: 'Mean Squared', 1: 'Mean Absolute', 2: 'Root Mean Squared'}
        fig, ax = plt.subplots(len(errors), sharex='col')
        for i, serrors in zip(range(len(errors)), errors):
            ax[i].plot(np.arange(0, len(serrors)), serrors, c=color_map[i])
            ax[i].set_title(label=str(error_names[i]) + ' errors over component life time', pad=3)
            ax[i].set_ylabel(ylabel=str(error_names[i]) + ' error', labelpad=3)
        plt.show()






features, feature_names =  Preprocess_Unsupervised_MultipleBearingWithFail_Data(data_path='/home/giuseppe/Desktop/Projects/MLAlgorithmsExamples/Bearing DataSet/archive/1st_test/1st_testA/',
                                                                           standardize=True)

r2_scores, d2_absolute_scores, d2_tweedie_score, d2_pinball_scores, ms_error, ma_error, rms_error = RandomForestRegressor_MultipleBearning_Score_Degradation_Analysis(features=features,
                                                                  feature_names=feature_names,
                                                                  rf_random_state=42,
                                                                  rf_nestimators=1000,
                                                                  predicted_nfeature=4,
                                                                  max_train_test_split_index=1000,
                                                                  train_nsamples_step=200,
                                                                  test_nsamples_step=1000,
                                                                  single_test=True,
                                                                                                                                            show=False, plot=False)



# RandomForestRegressor_DigitalTwin_Score_Degradation_Analysis(data_path='/home/giuseppe/Desktop/Projects/MLAlgorithmsExamples/CSV_Files/',
#                                                             rf_random_state=42,
#                                                             rf_nestimators=10,
#                                                             predicted_nfeature=125003,
#                                                             training_nsamples_step=3,
#                                                             test_nsamples_step=2)




