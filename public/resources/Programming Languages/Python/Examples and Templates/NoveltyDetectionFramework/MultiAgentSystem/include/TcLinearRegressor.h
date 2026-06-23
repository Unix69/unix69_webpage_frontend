/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#ifndef TCLINEARREGRESSOR_H
#define TCLINEARREGRESSOR_H

#include <vector>
#include <chrono>
#include <stdio.h>
#include <exception>
#include <boost/math/statistics/linear_regression.hpp>
#include "TcColors.h"

//y = a0 + a1*x

using namespace std;

template <class x, class y>
class TcLinearRegressor {
    private:
        double rmQ;
        double rmM;    
    public:
    class TcError {
    public:
        class TcPrediction {
        public:
            static const int kValidPrediction = 0;
            static const int kErr_NoWeights = -1;
            static const int kErr_NoWeightsFeaturesRelationship = -2;
            static const int kErr_NoFeatures = -3;
        };
        class TcTraining {
        public:
            static const int kValidTraining = 0;
            static const int kErr_NoLabels = -4;
            static const int kErr_InvalidDataSize = -5;
            static const int kErr_NoFeatures = -3;
            static const int kErr_MathMultiply = -6;
            static const int kErr_MathMultiplyMatVect = -7;
            static const int kErr_MathInverse = -8;
            static const int kErr_MathTranspose = -9;
        };
    };

    TcLinearRegressor() {}
    ~TcLinearRegressor() {}

    int fTrain(vector<x> pX, vector<y> pY) {
        
        using boost::math::statistics::simple_ordinary_least_squares;
        using boost::math::statistics::mean;

        int n = pX.size();
        int len = n / 2;

        vector<double> subX1(pX.begin(), pX.begin() + len);
        vector<double> subX2(pX.begin() + len + 1, pX.end());
        vector<double> subTime1(pY.begin(), pY.begin() + len);
        vector<double> subTime2(pY.begin() + len + 1, pY.end());

        double mean1 = mean(subX1);
        double mean2 = mean(subX2);
        double meanT1 = mean(subTime1);
        double meanT2 = mean(subTime2);

        list<double> xFinal{ mean2, mean1 };
        list<double> yFinal{ meanT2,meanT1 };

        auto [c0, c1] = simple_ordinary_least_squares(xFinal, yFinal);

        this->rmM = c1;
        this->rmQ = c0;

/*
        double sumX = 0;
        double sumX2 = 0;
        double sumY = 0;
        double sumXY = 0;
        
        fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	    fflush(stdout);

        if(pX.size() <= 0 || pX.size() != pY.size()){
            fprintf(stdout, ANSI_COLOR_RED "(%s) Invalid data size X=%d, Y=%d"  ANSI_COLOR_RESET "\n",  __func__, (int) pX.size(), (int) pY.size());
		    fflush(stdout);
            return(TcError::TcTraining::kErr_InvalidDataSize);
        }

        for(int i=0;i<n;i++){
            sumX = sumX + pX[i];
            sumX2 = sumX2 + pX[i]*pX[i];
            sumY = sumY + pY[i];
            sumXY = sumXY + pX[i] * ((x) pY[i]);
        }

        // Calculating a and b
        this->rmM = (double) (n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
        this->rmQ = (double) (sumY - this->rmM*sumX)/n;

*/
        fprintf(stdout, "(%s) Equation of best fit is: y = %f + %fx\n", __func__, this->rmQ, this->rmM);
		fflush(stdout);

        fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	    fflush(stdout);
        
        return(TcError::TcTraining::kValidTraining);
    }
    
    void fPredict(x pSample, y* pPredictedValue){
        fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	    fflush(stdout);
        
        *pPredictedValue = (y) (this->rmQ + this->rmM*pSample);

        fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	    fflush(stdout);

    }
    double fGetM(){
        fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	    fflush(stdout);
        
        double rM = this->rmM;

        fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	    fflush(stdout);
        return(rM);

    }
    double fGetQ(){
        fprintf(stdout, "(%s) Enter in %s \n", __func__, __func__);
	    fflush(stdout);
        
        double rQ = this->rmQ;

        fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
	    fflush(stdout);
        return(rQ);

    }    

    
};



#endif

