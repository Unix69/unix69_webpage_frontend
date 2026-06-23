import numpy as np
#from matplotlib import pyplot as plt
from scipy.stats import norm
import sys
import datetime as dt
import time as tm
#from bisect import bisect_left


#class ecdf:
 #   def __init__(self, data):
  #      self.data = data
   #     self.data_len = float(len(data))

   # def __call__(self, point):
    #    return (len(self.data[:bisect_left(self.data, point)]) /
     #           self.data_len)





#function definition
def getGeneralLogData(filename, time_queue, time_add, time_remove):


        f = open(filename, "r")
        lines = f.readlines()
        f.close()
        lines = lines[1 : len(lines)]
        n = len(lines)
        time_latency = [None] * n
	sent = []
	lost = []

	for i in lines:
		sp = i.split('\t')
		pkt = int(sp[0])
		tadd = int(sp[1])
		tack = int(sp[2])
                
                if tadd > 0 and tack <> 0:
                     time_queue[pkt] = tack - tadd 
                     time_add[pkt] = tadd
                     time_remove[pkt] = tack
                     sent.append(pkt)
                     time_latency[pkt] = tack - tadd
                else:
                    if tadd > 0:
                        time_queue[pkt] = -tadd
                        time_remove[pkt] = 0
                        time_add[pkt] = tadd
                        lost.append(pkt)
                    else:
                        lost.append(pkt)

	return(lost, sent, time_latency)
	


def getSpecialLogData(filename, time_add_red, time_queue, time_add, time_remove, time_queue_other, time_remove_other):
        n = len(time_add_red)
        sent = []
	lost = []
        time_latency = [None] * n
        trans = {}
        ctrans = 0

	f = open(filename, "r")
	lines = f.readlines()
	f.close() 
	lines = lines[1 : len(lines)]

	for i in lines:
		sp = i.split('\t')
		pkt = int(sp[0])
		tsend = int(sp[1])
		tack = int(sp[2])
		ntx = int(sp[3])
		ack = int(sp[4])
		r1 = int(sp[5])
		r2 = int(sp[6])
		trans[pkt] = trans.get(pkt, 0) + 1
		ctrans = ctrans + 1
	
		if ack == 0 and r1 == 1 and r2 == 0:
                        tadd = time_add_red[pkt]
                        time_queue[pkt] = tack - tadd
                        time_add[pkt] = tadd
			time_remove[pkt] = tack
			lost.append(pkt)
		elif ack == 1 and r1 == 1 and r2 == 1:
                        tadd = time_add_red[pkt]
                        time_queue[pkt] = tack - tadd
                        time_queue_other[pkt] = tack - tadd
                        time_latency[pkt] = tack - tadd
                        time_add[pkt] = tadd
			time_remove[pkt] = tack
			time_remove_other[pkt] = tack
			sent.append(pkt)
		elif ack == 1 and r1 == 1 and r2 == 0:
                        tadd = time_add_red[pkt]
                        time_queue[pkt] = tack - tadd
                        time_latency[pkt] = tack - tadd
                        time_add[pkt] = tadd
			time_remove[pkt] = tack
			sent.append(pkt)
		elif ack == 1 and r1 == 0 and r2 == 1:
                        tadd = time_add_red[pkt]
                        time_queue_other[pkt] = tack - tadd
                        time_add[pkt] = tadd
			time_remove_other[pkt] = tack
			sent.append(pkt)
		elif ack == 1 and r1 == 0 and r2 == 0:
                        tadd = time_add_red[pkt]
                        time_latency[pkt] = tack - tadd
                        time_add[pkt] = tadd
			sent.append(pkt)
	
	return(lost, sent, time_latency, trans, ctrans)




def convertIntoDateTime(time_list):
        n = len(time_list)
        dt_history = [None] * 2 * n
        time_history_queue = [None] * 2 * n
        timestamp_rescale_sec_factor = 1000000
        timestamp_rescale_minute_factor = timestamp_rescale_sec_factor * 60
        k = 0
        time_offset = 0
        microsec = 0

        while time_list[k] < 0:
            k = k + 1

        time_offset = time_list[k]
        k = 0

        for time in time_list:
            if time > 0:
                microsec = int(timestamp_rescale_sec_factor) * (float(time - time_offset) / float(FREQUENCY))
                minute = float(float(microsec) / float(timestamp_rescale_minute_factor))
                microsec = microsec - int(int(minute) * int(timestamp_rescale_minute_factor))
                sec = float(float(microsec) / float(timestamp_rescale_sec_factor))
                microsec = microsec - int(int(sec) * int(timestamp_rescale_sec_factor))
                dt_history[k] = dt.time(0, int (minute), int(sec), int(microsec))
            else:
                dt_history[k] = dt.time(0, 0, 0, 0)
            k = k + 1


        return(dt_history)







def computeQueueHistory(time_add, time_remove):
	n = len(time_add)

        time_history_queue = [None] * 2 * n
        timestamp_history_queue = [None] * 2 * n

	i = 0
	j = 0
	s = 0
	c = 0
	end = n * 2
	while c < end:
		if i == n:
			s = s + 1
			time_history_queue[c] = s 
                        timestamp_history_queue[c] = time_add[j]
			j = j + 1
		elif j == n:
			s = s - 1 		
			time_history_queue[c] = s
                        timestamp_history_queue[c] = time_remove[i]
			i = i + 1	
		elif time_remove[i] > time_add[j]:
			s = s + 1
			time_history_queue[c] = s
                        timestamp_history_queue[c] = time_add[j]
			j = j + 1
		elif time_remove[i] < time_add[j]:
			s = s - 1 		
			time_history_queue[c] = s
                        timestamp_history_queue[c] = time_remove[i]
			i = i + 1
		c = c + 1
	return(time_history_queue, timestamp_history_queue)


def computeOverlappingFactor(sent_0, sent_1):
	overlapping = 0	
	for i in sent_0:
		if i in sent_1:
			overlapping = overlapping + 1
	return(overlapping)

def computeTransmissionsFrequency(trans):
	trys = {}
	for pkt, times in trans.items():
		trys[times] = trys.get(times, 0) + 1
	return(trys)


def computeStatisticalData(time_latency_red, time_latency_0, time_latency_1):


        time_latency_red_list = [time for time in time_latency_red if time > 0]
        time_latency_0_list = [time for time in time_latency_0 if time > 0]
        time_latency_1_list = [time for time in time_latency_1 if time > 0]

	mean_red = np.mean(time_latency_red_list)
	mean_0 = np.mean(time_latency_0_list)
	mean_1 = np.mean(time_latency_1_list)
	
	std_red = np.std(time_latency_red_list)
	std_0 = np.std(time_latency_0_list)
	std_1 = np.std(time_latency_1_list)

	min_red = min(time_latency_red_list) 
	min_0 = min(time_latency_0_list) 
	min_1 = min(time_latency_1_list) 

	max_red = max(time_latency_red_list)
	max_0 = max(time_latency_0_list)
	max_1 = max(time_latency_1_list)
        
        perc99_red = np.percentile(time_latency_red_list, 99)
        perc99_0 = np.percentile(time_latency_0_list, 99)
        perc99_1 = np.percentile(time_latency_1_list, 99)

        perc999_red = np.percentile(time_latency_red_list, 99.9)
        perc999_0 = np.percentile(time_latency_0_list, 99.9)
        perc999_1 = np.percentile(time_latency_1_list, 99.9)
        
        perc9999_red = np.percentile(time_latency_red_list, 99.99)
        perc9999_0 = np.percentile(time_latency_0_list, 99.99)
        perc9999_1 = np.percentile(time_latency_1_list, 99.99)


	return(mean_red, mean_0, mean_1, std_red, std_0, std_1, min_red, min_0, min_1, max_red, max_0, max_1, perc99_red, perc99_0, perc99_1, perc999_red, perc999_0, perc999_1, perc9999_red, perc9999_0, perc9999_1)




def computeDeltaLatency(time_latency, latency_threshold_0, latency_threshold_1, latency_threshold_2):

    time_latency_list = [time for time in time_latency if time > 0]
    count_pkt_latency_0 = 0
    count_pkt_latency_1 = 0
    count_pkt_latency_2 = 0
    delta_latency_0 = 0
    delta_latency_1 = 0
    delta_latency_2 = 0




    for latency in time_latency_list:
        if latency < latency_threshold_0:
            count_pkt_latency_0 = count_pkt_latency_0 + 1
        if latency < latency_threshold_1:
            count_pkt_latency_1 = count_pkt_latency_1 + 1
        if latency < latency_threshold_2:
            count_pkt_latency_2 = count_pkt_latency_2 + 1


    

    delta_latency_0 = 100 * (float(count_pkt_latency_0) / float(len(time_latency_list)))
    delta_latency_1 = 100 * (float(count_pkt_latency_1) / float(len(time_latency_list)))
    delta_latency_2 = 100 * (float(count_pkt_latency_2) / float(len(time_latency_list)))

    return delta_latency_0, delta_latency_1, delta_latency_2



def writeOutputForProf(filename, time_latency):
    with open(str(filename), 'w') as f:
        for item in time_latency:
                f.write("%s\n" % item)
        f.close()


if len(sys.argv) != 5:
        print("Argument Error")
        sys.exit()

logger_s = str(sys.argv[1])
logger_0 = str(sys.argv[2])
logger_1 = str(sys.argv[3])
n = int(sys.argv[4])

trans_0 = {}
trans_1 = {}

try_0 = {}
try_1 = {}

time_latency_red = []
time_queue_red = [None] * n
time_add_red = [None] * n
time_remove_red = [None] * n
lost_red = []
sent_red = []


time_latency_0 = []
time_queue_0 = [None] * n
time_add_0 = [None] * n
time_remove_0 = [None] * n
lost_0 = []
sent_0 = []


time_latency_1 = []
time_queue_1 = [None] * n
time_add_1 = [None] * n
time_remove_1 = [None] * n
lost_1 = []
sent_1 = [] 



FREQUENCY=2826194000
timestamp_rescale_factor = 1000
ctrans_0 = 0
ctrans_1 = 0
overlapping = 0

ttime_0 = 0
ttime_1 = 0
ttime_s = 0

#Red
lost_red, sent_red, time_latency_red = getGeneralLogData(logger_s, time_queue_red, time_add_red, time_remove_red)

writeOutputForProf('ChannelRed', time_latency_red)


#0- 1
lost_0, sent_0, time_latency_0, trans_0, ctran_0 = getSpecialLogData(logger_0, time_add_red, time_queue_0, time_add_0, time_remove_0, time_queue_1, time_remove_1)

writeOutputForProf('Channel0', time_latency_0)


lost_1, sent_1, time_latency_1, trans_1, ctrans_1 = getSpecialLogData(logger_1, time_add_red, time_queue_1, time_add_1, time_remove_1, time_queue_0, time_remove_0)

writeOutputForProf("Channel1", time_latency_1)




mean_red, mean_0, mean_1, std_red, std_0, std_1, min_red, min_0, min_1, max_red, max_0, max_1, perc99_red, perc99_0, perc99_1, perc999_red, perc999_0, perc999_1, perc9999_red, perc9999_0, perc9999_1 = computeStatisticalData(time_latency_red, time_latency_0, time_latency_1)

delta_threshold_0 = (float(5) / float(timestamp_rescale_factor)) * float(FREQUENCY)
delta_threshold_1 =  (float(10) / float(timestamp_rescale_factor)) * float(FREQUENCY) 
delta_threshold_2 =  (float(30) / float(timestamp_rescale_factor)) * float(FREQUENCY) 


delta_latency_0_red, delta_latency_1_red, delta_latency_2_red = computeDeltaLatency(time_latency_red, delta_threshold_0, delta_threshold_1, delta_threshold_2)
delta_latency_0_0, delta_latency_1_0, delta_latency_2_0 = computeDeltaLatency(time_latency_0, delta_threshold_0, delta_threshold_1, delta_threshold_2)
delta_latency_0_1, delta_latency_1_1, delta_latency_2_1 = computeDeltaLatency(time_latency_1, delta_threshold_0, delta_threshold_1, delta_threshold_2)



#Queue History with scaled timestamp 
#Parallel vectors: data vector queue_history_x (x3) and vector time_history_queue_x (x3)
#After this computation i nedd to plot this triple of double vector on python grafics
time_history_queue_red, timestamp_history_queue_red =  computeQueueHistory(time_add_red, time_remove_red)
datetime_history_queue_red = convertIntoDateTime(timestamp_history_queue_red)

time_history_queue_0, timestamp_history_queue_0 =  computeQueueHistory(time_add_0, time_remove_0)
datetime_history_queue_0 = convertIntoDateTime(timestamp_history_queue_0)

time_history_queue_1, timestamp_history_queue_1 =  computeQueueHistory(time_add_1, time_remove_1)
datetime_history_queue_1 = convertIntoDateTime(timestamp_history_queue_1)




#output
print("\n")
print("MEAN:")
print("\n")
print("mean time packets on channel(0+1) = " + str(float(timestamp_rescale_factor) * (float(mean_red) / float(FREQUENCY))))
print("mean time packets on channel(0) = " +   str(float(timestamp_rescale_factor) * (float(mean_0) / float(FREQUENCY))))  
print("mean time packets on channel(1) = " +  str(float(timestamp_rescale_factor) * (float(mean_1) / float(FREQUENCY))))
print("\n")
print("STD:")
print("\n")
print("std time packets on channel(0+1) = " +  str(float(timestamp_rescale_factor) * (float(std_red) / float(FREQUENCY))))
print("std time packets on channel(0) = " +  str(float(timestamp_rescale_factor) * (float(std_0) / float(FREQUENCY))))
print("std time packets on channel(1) = " +  str(float(timestamp_rescale_factor) * (float(std_1) / float(FREQUENCY))))
print("\n")
print("MIN:")
print("\n")
print("min time packets on channel(0+1) = " +  str(float(timestamp_rescale_factor) * (float(min_red) / float(FREQUENCY))))
print("min time packets on channel(0) = " +  str(float(timestamp_rescale_factor) * (float(min_0) / float(FREQUENCY))))
print("min time packets on channel(1) = " +  str(float(timestamp_rescale_factor) * (float(min_1) / float(FREQUENCY))))
print("\n")
print("MAX:")
print("\n")
print("max time packets on channel(0+1) = " +  str(float(timestamp_rescale_factor) * (float(max_red) / float(FREQUENCY))))
print("max time packets on channel(0) = " +  str(float(timestamp_rescale_factor) * (float(max_0) / float(FREQUENCY))))
print("max time packets on channel(1) = " +  str(float(timestamp_rescale_factor) * (float(max_1) / float(FREQUENCY))))
print("\n")
print("Percentile 99%")
print(str("percentile 99% time on channel (0+1) = ") + str(float(timestamp_rescale_factor) * (float(perc99_red) / float(FREQUENCY))))
print(str("percentile 99% time on channel (0) = ") + str(float(timestamp_rescale_factor) * (float(perc99_0) / float(FREQUENCY))))
print(str("percentile 99% time on channel (1) = ") + str(float(timestamp_rescale_factor) * (float(perc99_1) / float(FREQUENCY))))
print("\n")
print("Percentile 99.9%")
print(str("percentile 99.9% time on channel (0+1) = ") + str(float(timestamp_rescale_factor) * (float(perc999_red) / float(FREQUENCY))))
print(str("percentile 99.9% time on channel (0) = ") + str(float(timestamp_rescale_factor) * (float(perc999_0) / float(FREQUENCY))))
print(str("percentile 99.9% time on channel (1) = ") + str(float(timestamp_rescale_factor) * (float(perc999_1) / float(FREQUENCY))))
print("\n")
print("Percentile 99.99%")
print(str("percentile 99.99% time on channel (0+1) = ") + str(float(timestamp_rescale_factor) * (float(perc9999_red) / float(FREQUENCY))))
print(str("percentile 99.99% time on channel (0) = ") + str(float(timestamp_rescale_factor) * (float(perc9999_0) / float(FREQUENCY))))
print(str("percentile 99.99% time on channel (1) = ") + str(float(timestamp_rescale_factor) * (float(perc9999_1) / float(FREQUENCY))))

print("\n\n")
print("--------------------------------------")
print("\n")
print("sent packets on channel(0+1) = " + str(len(sent_red)))
print("lost packets on channel(0+1) = " + str(len(lost_red)))
print("\n")
print("--------------------------------------")
print("\n")
print("transmissions on channel(0)=" + str(ctrans_0))
print("sent packets on channel(0)=" + str(len(sent_0)))
print("lost packets on channel(0)=" + str(len(lost_0)))
print("trasmitted packets on channel(0)=" + str(len(trans_0)))
for times, pkts in try_0.items():
	perc = float(pkts)/len(trans_0) * 100
	print("packets trasmitted " + str(times) + " times=" + str(perc) + "%")
print("\n")
print("--------------------------------------")
print("\n")
print("transmissions on channel(1)=" + str(ctrans_1))
print("sent packets on channel(1)=" + str(len(sent_1)))
print("lost packets on channel(1)=" + str(len(lost_1)))
print("trasmitted packets on channel(1)=" + str(len(trans_1)))
for times, pkts in try_1.items():
	perc = float(pkts)/len(trans_1) * 100
	print("packets trasmitted " + str(times) + " times=" + str(perc) + "%")
        




#plot normal distribution of channel timelaps data
#x_s = np.linspace(mean_s - 4*std_s, mean_s + 4*std_s, 10000)
#x_0 = np.linspace(mean_0 - 4*std_0, mean_0 + 4*std_0, 10000)
#x_1 = np.linspace(mean_1 - 4*std_1, mean_1 + 4*std_1, 10000)
#norm_s_pdf = norm.pdf(x_s, mean_s, std_s)
#norm_0_pdf = norm.pdf(x_0, mean_0, std_0)
#norm_1_pdf = norm.pdf(x_1, mean_1, std_1)
#norm_s_cdf = norm.cdf(x_s, mean_s, std_s)
#norm_0_cdf = norm.cdf(x_0, mean_0, std_0)
#norm_1_cdf = norm.cdf(x_1, mean_1, std_1)

#plot pdf of timelaps
#plt.figure(1)
#plt.plot(x_s, norm_s_pdf, x_0, norm_0_pdf, x_1, norm_1_pdf)
#plt.grid()
#plt.title('PDF of Timelaps Samples on each channel')
#plt.xlabel('Timelaps')
#plt.ylabel('Probabilities Timelaps Distributions')
#plt.legend()


#plot cdf of timelaps
#plt.figure(2)
#plt.plot(x_s, norm_s_cdf, x_0, norm_0_cdf, x_1, norm_1_cdf)
#plt.grid()
#plt.title('CDF of Timelaps Samples on each channel')
#plt.xlabel('Timelaps')
#plt.ylabel('Probabilities Timelaps Cumulative Distributions')
#plt.legend()


#time_s_array = np.array(list(time_s.values()))
#time_0_array = np.array(list(time_0.values()))
#time_1_array = np.array(list(time_1.values()))
#norm_s_cdf = ecdf(time_s_array)
#norm_0_cdf = ecdf(time_0_array)
#norm_1_cdf = ecdf(time_1_array)
#x_s = range(0, max_s)
#x_0 = range(0, max_0)
#x_1 = range(0, max_1)
#y_s = [norm_s_cdf(point) for point in x_s]
#y_0 = [norm_0_cdf(point) for point in x_0]
#y_1 = [norm_1_cdf(point) for point in x_1]
#plt.plot(x_s, y_s)
#plt.plot(x_0, y_0)
#plt.plot(x_1, y_1)






#plot queue history in two figures
#time_history_q0_list = [ i for i in time_history_q0.values() ]
#time_history_q1_list = [ i for i in time_history_q1.values() ]
#plt.figure(3) 
#plt.plot(time_history_q0_list
#plt.figure(4)
#plt.plot(time_history_q1_list)



#plt.show()







sys.exit()


