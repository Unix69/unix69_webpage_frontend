# from url https://towardsdatascience.com/pca-using-python-scikit-learn-e653f8989e60
from matplotlib import pyplot as plt
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pandas as pd
import numpy as np

class PCA_Analyzer(object):
    def __init__(self, features, labels, features_names, label_name):
        self.__features__ = features
        self.__labels__ = labels
        self.__features_names__ = features_names
        self.__label_name__ = label_name

    def PCA(self, n_components):
        features = StandardScaler().fit_transform(self.__features__)
        pca = PCA(n_components=n_components)
        principal_components = pca.fit_transform(features)
        pcs_df = pd.DataFrame(data=principal_components
                              , columns=['principal component %i' % npc for npc in range(n_components)])
        final_principal_component = np.concatenate([principal_components, self.__labels__])
        final_pcs_df = pd.concat(
            [pcs_df, pd.DataFrame(data=self.__labels__, columns=[self.__label_name__])[self.__label_name__]], axis=1)
        return principal_components, final_principal_component, pcs_df, final_pcs_df

    def Plot_PCA(self, principal_components, first_n_component, second_n_component):
        fig = plt.figure()
        ax = fig.add_subplot(1, 1, 1)
        ax.set_xlabel('Principal Component ' + str(first_n_component), fontsize=15)
        ax.set_ylabel('Principal Component ' + str(second_n_component), fontsize=15)
        ax.set_title('2 component PCA', fontsize=20)
        ax.scatter(principal_components[:, first_n_component], principal_components[:, second_n_component], s=50)
        ax.grid()

    def Plot_PCA(self, principal_components, plot_pc_limit):
        if plot_pc_limit >= principal_components.__len__():
            return

        for i in range(plot_pc_limit - 1):
            j = i + 1
            fig = plt.figure()
            ax = fig.add_subplot(1, 1, 1)
            ax.set_xlabel('Principal Component ' + str(i), fontsize=15)
            ax.set_ylabel('Principal Component ' + str(j), fontsize=15)
            ax.set_title('2 component PCA', fontsize=20)
            ax.scatter(principal_components[:, i], principal_components[:, j], s=50)
            ax.grid()