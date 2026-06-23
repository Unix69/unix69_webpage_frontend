#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define MAXN 200
#include "queue.h"
struct coda{
int *v;
int head;
int tail;
int N;
int M;
};

QUEUE INIT(int maxn){
if(maxn > MAXN)
    return NULL;
QUEUE q = malloc(sizeof(QUEUE));
q->v = malloc(maxn*sizeof(int));
q->head = 0;
q->tail = 0;
q->N = 0;
q->M = maxn;
return(q);
}

int Put(QUEUE q, int ele){
if((q->tail)%(q->M) == q->head)
return(-1);
q->tail %= q->M;
q->v[q->tail++] = ele;
q->N++;
return 1;
}

int Get(QUEUE q){
if(q->head == q->head)
    return -1;
  q->head %= q->M;
  int x = q->v[q->head++];
  q->N--;
  return(x);
}

int Empty(QUEUE q){
return(q->N != q->M);
}


int Full(QUEUE q){
return(q->N == q->M);
}

void Free_Queue(QUEUE q){
free(q->v);
free(q);
}


int Free_node(QUEUE q, int ele){
int i, j, flag = 0;
for(i = (q->tail) - 1; i >= q->head; i--){
if(q->v[i] == ele){
    flag = 1;
    break;
}
}

if(flag == 0)
    return(-1);
    else{
    for(j = i; j < q->tail; q->v[j] = q->v[j+1], j++);
    q->N--;
    return flag;
    }
}













