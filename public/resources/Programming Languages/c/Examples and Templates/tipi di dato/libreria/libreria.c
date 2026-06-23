#include <stdio.h>
#include <stdlib.h>



int strcmpn(char *str1, char *str2){
int n1 = strlen(str1);
int n2 = strlen(str2);
int flag = 1;
int i = 0;
int j = 0;
if(n1>n2)
    return 0;
else{
    while(flag==1){
        if(str1[i++] != str2[j++] && n1 < (n2-j))
            i=0;
        else if(str1[i++] != str2[j++] && n1 > (n2-j))
            flag = 0;
    }
}
    if(flag == 0)
      return 0;
        else
          return 1;
}


int binsearch(int, a, int r, int l, int *vet)
{
    int m;
    while(flag == 0 && r!=(l+1)){
    m = (r + l) / 2;
    if (vet[m] > a)
        r = m;
    else if(vet[m] == a)
        flag = 1;
    else
        l = m;
    }
     if(flag == 0)
      return 0;
        else
          return 1;
    }

 int ric_binsearch(int a, int r, int l, int *vet, int flag)
    {
        flag = 0;
        int m;
        if(r==l){
        if(vet[m] == a){
            flag = 1;
            return;}
        else
            return;}
        m = (r + l) / 2;
        if (vet[m] > a)
          ric_binsearch(a, m, l, vet, flag);
            else
            ric_binsearch(a, r, m, vet, flag);
        return flag;
    }


    int * str_freq(char *str1)
    {
        int n = strlen(str1);
        int freq0[256];
        int *freq;
        int j = 0;
        int count = 0;

        for(i = 0; i < n; i++)
             freq0[i] = 0

        for(i = 0; i < n; i++){
        if(freq0[str1[i]] == 0)
        count ++;
        freq0[str1[i]]++;
        }

        freq = (int *)malloc(count * sizeof(int));

        for(i = 0; i < 256; i++){
            if((j + 1) > n)
                break;
            if(freq0[i] != 0){
                freq[j] = freq0[i]
                j++;
                }
        }
      return(freq);
    }

    int ric_maxbinsearch(int r, int l, int *vet, int flag)
    {
        int m;
        int u,v;
        m = (r + l) / 2;

        if(r==l){
        max = vet[l];
            return max;
          u = ric_binsearch(a, m, l, vet, flag);
          v = ric_binsearch(a, r, m+1, vet, flag);

        if(u > v)
            return u;
        else
            return v;

    }

     void selection_sort(int **vet, int n)
     {
         int temp1;
         int *vet0 = *vet;
         int i, j;
         int min;
         for(j = 0; j < n; j++){
         min = j;

         for(i = j + 1; i < n; i++){
             if(vet0[i] < min)
                min = i;
         }

         temp1 = vet0[j];
         vet0[j] = vet0[min];
         vet0[min] = temp1;
            }
         *vet = vet0;
            return;
            }

    void insertion_sort(int **vet, int n){
        int *vet0 = *vet;
        int i, j;
        int temp;

        for(i = 1; i< n; i++){
          temp = vet0[i];
          while(j >= 0 && temp < vet0[j]){
            vet0[j+1] = vet0[j];
            j--;
            }
          vet0[j+1] = temp;
          }
          }



    void shell_sort(int **vet, int n){

        int *vet0 = *vet;
        int i, j;
        int temp;
        while(h < n/3)
            h = h*3 +1;
        while(h >= 1){
        for(i = h; i < n; i++){
                j=i;
          temp = vet0[i];
          while(j >= h && temp < vet0[j-h]){
            vet0[j] = vet0[j-h];
            j-=h;
            }
            vet0[j+h] = temp;
            h=h/3;
          }
        }
}






































