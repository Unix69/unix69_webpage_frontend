#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXN 200
#include "Stack-array.h"

struct Stack {
int *s;
int N;
int M;
};


STACK INIT(int maxn){

if(maxn > MAXN){
    printf("Stack non inizializzato\nDimensione troppo elevata");
    return NULL;
}

STACK sp = malloc(sizeof(STACK));
sp->s = malloc(maxn*sizeof(int*));
sp->N = 0;
sp->M = maxn;
return(sp);
}


void Push(STACK sp, int ele){
if(Full(sp))
    return;
else
sp->s[sp->N++] = ele;
return;
}


int Pop(STACK sp){
return(sp->s[(sp->N)--]);
}

int Full(STACK sp){
return(sp->N == sp->M);
}


int Empty(STACK sp){
return(sp->N == 0);
}


void Free(STACK sp){
free(sp->s);
free(sp);
sp = NULL;
}


int Free_node(STACK sp, int ele){

int i, j, flag = 0;
for(i = sp->N; i>=0; i--){
if(sp->s[i] == ele){
    flag = 1;
    break;
}
}

if(flag == 0)
    return(-1);
else{
    for(j = i; j < sp->N; sp->s[j] = sp->s[j+1], j++);
    (sp->N)--;
    return flag;
    }
}






