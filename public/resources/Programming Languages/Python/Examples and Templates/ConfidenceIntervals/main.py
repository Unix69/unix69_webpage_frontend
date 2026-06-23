import numpy as np
import scipy.stats as st
import random as rd
from matplotlib import pyplot as plt

nref_mu = 0
nref_sigma = 3
n_samples = 2000
samples = st.norm.rvs(size=n_samples)
n_obs = round((3/4)*n_samples)
observations = rd.sample(list(samples), n_obs)
confidence = 0.9

zscore = st.norm.ppf((1-confidence)/2)
print('zscore = '+str(zscore) + ', confidence = ' + str(zscore))

# create 90% confidence interval
tupper_bound, tlower_bound = st.t.interval(alpha=1-confidence, df=len(observations) - 1,
              loc=np.mean(observations),
              scale=st.sem(observations))

nupper_bound, nlower_bound = st.norm.interval(alpha=1-confidence,
              loc=np.mean(observations),
              scale=st.sem(observations))

nref_samples = np.linspace(nref_mu - 6*nref_sigma, nref_mu + 6*nref_sigma, n_samples)
nref_obs = np.linspace(nref_mu - 6*nref_sigma, nref_mu + 6*nref_sigma, n_obs)


figure = plt.figure()
plt.title('Student estimation CI = [' + str(tlower_bound) + ', ' + str(tupper_bound) + '] with confidence ' + str(confidence)
          + ', Normal estimation CI = [' + str(nlower_bound) + ', ' + str(nupper_bound) + '] with confidence ' + str(confidence))
plt.suptitle('mean of samples = ' + str(np.mean(samples)) + ', mean of observations = ' + str(np.mean(observations)))
plt.xlabel("X ~ normal distribution (mu=0, sigma=1)")
plt.plot(samples, 2*np.random.random(size=n_samples), '.', color='green')
plt.plot(observations, 2*np.random.random(size=n_obs), '.', color='blue')
plt.plot(nref_samples, 2*st.norm.pdf(nref_samples, nref_mu, 1), color='red')
plt.axline(xy1=(tupper_bound, 1), xy2=(tupper_bound, -1), color='red')
plt.axline(xy1=(tlower_bound, 1), xy2=(tlower_bound, -1), color='red')
plt.axline(xy1=(nupper_bound, 1), xy2=(nupper_bound, -1), color='orange')
plt.axline(xy1=(nlower_bound, 1), xy2=(nlower_bound, -1), color='orange')
plt.axline(xy1=(zscore, 1), xy2=(zscore, -1), color='green')
plt.axline(xy1=(-zscore, 1), xy2=(-zscore, -1), color='green')
plt.xlim(-5,5)
plt.ylim(0,2.1)
plt.show()

