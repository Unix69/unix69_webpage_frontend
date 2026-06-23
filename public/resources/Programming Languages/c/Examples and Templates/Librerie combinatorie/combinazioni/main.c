#include <stdio.h>
#include <stdlib.h>
int init(int ***val, int **sol, int **num_scelte);
int moltiplicazione (int *sol, int **val, int *num_scelte, int n, int pos, int count);
void sol_display(int *sol, int n);

int init(int ***val, int **sol, int **num_scelte){
int n;
int i,j;
int **matr, *sol0, *num_scelte0;
matr = *val;
sol0 = *sol;
num_scelte0 = *num_scelte;

printf("Inserire il numero di livelli di scelta dell'albero -> ");
scanf("%d", &n);
matr = malloc(n*sizeof(int **));
num_scelte0 = malloc(n*sizeof(int*));
sol0 = malloc(n*sizeof(int*));

for(i = 0; i< n; i++){
system("cls");
printf("\nInserire il numero di scelte per il livello %d : ", (i+1));
scanf("%d", &(num_scelte0[i]));
matr[i] = malloc(num_scelte0[i]*sizeof(int *));
printf("\nInserire le scelte del livello %d in fila -> ", (i+1));

for(j = 0; j < num_scelte0[i]; j++){
    printf("\n");
    scanf("%d", &(matr[i][j]));
    }
}
*val = matr;
*sol = sol0;
*num_scelte = num_scelte0;
return(n);
}

void sol_display(int *sol, int n){
int i;
printf("Soluzione -> ");
for(i = 0; i< n; i++)
    printf("%d ", sol[i]);
return;
}

int moltiplicazione (int *sol, int **val, int *num_scelte, int n, int pos, int count){
int i;
if(pos >= n){
sol_display(sol, n);
return(count+1);
}

for(i = 0; i < num_scelte[pos]; i++){
    sol[pos] = val[pos][i];
    count = moltiplicazione(sol, val, num_scelte, n, pos+1, count);
}
return count;

}

int main()
{
    int count;
    int  **valori, *nscelte, *soluzioni, N;
    N = init(&valori, &soluzioni, &nscelte);
    system("cls");
    count = moltiplicazione(soluzioni, valori, nscelte, N, 0, 0);
    printf("\nIl numero di soluzioni e' %d \n", count);
    return 0;
}





