#include <stdio.h>
#include <stdlib.h>
void init(int n0, int **vet0, int **count0);
void countingsort(int n0, int *vet0, int **count0);
void stampacount(int n0, int **vet0, int *count0);
int i, j;
int appoggio[20];


void init(int n0, int **vet0, int **count0){
int *vet, *count;
vet = *vet0;
count = *count0;
printf("carica vettore denso");
for(i=0; i<n0; i++){
count[i] = 0;
printf("\n");
scanf("%d", &vet[i]);
}
*vet0 = vet;
*count0 = count;
return;
}

void stampacount(int n0, int **vet0, int *count0){
int *vet;
printf("ciao");
vet = *vet0;
for(i = n0; i > 0; i--){
 appoggio[count0[vet[i]]-1]=vet[i];
  count0[vet[i]]-=1;
  }
  printf("ciao");
    for(i = 0; i < n0; i++)
        vet[i]=appoggio[i];
*vet0 = vet;
return;
}



void countingsort(int n0, int *vet0, int **count0){
int *count;
count = *count0;
for(i = 0; i < n0; i++)
    count[vet0[i]]+=1;
for(i = 1; i < n0; i++)
        count[i] += count[i-1];
*count0 = count;

return;
}

int main()
{
int *vet, *count;
vet=(int *)malloc(20*sizeof(int));
count=(int *)malloc(20*sizeof(int));
init(20, &vet, &count);
countingsort(20, vet, &count);
stampacount(20, &vet, count);
return 0;
}
