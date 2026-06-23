#include <stdio.h>
#include <stdlib.h>
int K;


int init(int **val, int **sol, int **mark){

int n;
int i;
int *val0, *sol0, *mark0;
val0 = *val;
sol0 = *sol;
mark0 = *mark;

printf("Inserire la cardinalita' dell'insieme di partenza -> ");
scanf("%d", &n);
printf("\nInserire la cardinalita' dell'insieme delle disposizioni -> ");
scanf("%d", &K);
val0 = malloc(n*sizeof(int *));
mark0 = malloc(n*sizeof(int*));
sol0 = malloc(K*sizeof(int*));
printf("\n\nInserire gli elementi dell'insieme di partenza\n\n");
for(i = 0; i< n; i++){
if(i <= K){
    sol0[i] = 0;
}
mark0[i] = 0;
printf("%d)\t", i+1);
scanf("%d", &val0[i]);
printf("\n");
}

*val = val0;
*sol = sol0;
*mark = mark0;
return(n);
}

int disp_semplici(int *val, int *sol, int *mark, int n, int count, int pos){
int i;
if(pos >= K){
    sol_display(sol, count + 1);
return(count +1);
}
for(i = 0; i < n; i++){
   if(mark[i] == 0){
    mark[i] = 1;
    sol[pos] = val[i];
    count = disp_semplici(val, sol, mark, n, count, pos+1);
    mark[i] = 0;
   }
   }
   return(count);
}

void sol_display_powerset(int *sol, int *val, int n){
int j;
printf(" soluzioni -> { ");
for(j = n-1; j >=0; j--){
    if(sol[j] != 0){
        printf("%d ", val[j]);
        }
}
printf("}\n");
return;
}


void power_set(int *val, int *sol, int n, int pos){
if(pos >= n){
   sol_display_powerset(sol, val, n);
   return;
}
sol[pos] = 0;
power_set(val, sol, n, pos + 1);
sol[pos] = 1;
power_set(val, sol, n, pos + 1);
return;
}

void sol_display(int *sol, int count){
int i;
printf("\nSoluzione numero %d -> ", count);

for(i = 0; i< K; i++){
if(i != (K-1))
     printf("%d - ", sol[i]);
else
    printf("%d", sol[i]);
}
return;
}

int promising(int *val, int tot, int x, int psum, int pos){
    return((tot + psum) >= x)&&((psum + val[pos]) <= x);
}




void powerset_pruning(int *mark, int *val, int pos, int n, int tot, int x, int psum){
if(psum == x){
        sol_display_powerset(mark, val, n);
    return;
    }

if(promising(val, tot, x, psum, pos)){
    mark[pos] = 1;
    powerset_pruning(mark, val, pos +1, n, tot - val[pos], x, psum + val[pos]);
    mark[pos] = 0;
    powerset_pruning(mark, val, pos + 1, n, tot - val[pos], x, psum);
}
}























int disp_rip(int *val, int *sol, int n, int count, int pos){

int i;

if(pos >= K){
    sol_display(sol, count + 1);
return(count +1);
}

for(i = 0; i < n; i++){
    sol[pos] = val[i];
    count = disp_rip(val, sol, n, count, pos+1);
   }
   return(count);


}


int sum_val(int *val, int n){
int i = 0;
int tot = 0;
for(;i < n; tot+=val[i], i++);
return(tot);
}
