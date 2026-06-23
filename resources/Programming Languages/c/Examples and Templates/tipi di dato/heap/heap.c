#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include "heap.h"
#define parent(A) (A - 1) / 2
#define left(A) (A * 2) + 1
#define right(A) (A * 2) + 2

struct heap{
int *v;
int *key;
int size;
int max;
};

HEAP init(int maxn){
HEAP h;
h = malloc(sizeof(HEAP));
h->v = malloc(maxn*sizeof(int));
h->key = malloc(maxn*sizeof(int));
h->size = 0;
h->max=maxn;
return(h);
}

int empty(HEAP h){return(h->size==0);}

void fil(HEAP h, int a, int key_s){
h->v[h->size] = a;
h->key[h->size++] = key_s;
return;
}

void heapify(HEAP h, int i){
int r, l, largest;
r = right(i);
l = left(i);
largest = i;
if(largest < r)
    largest = r;
if(largest < l)
    largest = l;
if(largest != i){
    swap_index(largest, i, h);
heapify(h, largest);
}
return;
}

void swap_index(int a, int b, HEAP h){
    int temp;
    temp = h->v[a];
    h->v[a] = h->v[b];
    h->v[b] = temp;
    temp = h->key[a];
    h->key[a] = h->key[b];
    h->key[b] = temp;
    return;
}

void build_heap(HEAP h){
int i;
for(i = parent(h->size); i >= 0; i--)
heapify(h, i);
return;
}


void heap_sort(HEAP h){
int i;
build_heap(h);
int j = h->size;
for(i = h->size - 1; i > 0; i--){
    swap_index(i, 0, h);
    h->size--;
    heapify(h, 0);
}
h->size = j;
return;
}



void PQ_heap_insert(HEAP h, int a, int key_s){
int i = h->size++;
while(i >= 1 && h->key[parent(i)] < key_s){
h->key[i] = h->key[parent(i)];
h->v[i] = h->v[parent(i)];
i = parent(i);
}
h->v[i] = a;
return;
}


int PQ_heap_extract_max(HEAP h){
swap_index(0, (h->size)-1, h);
h->size--;
int x = h->v[h->size];
heapify(h, 0);
return(x);
}



void PQ_heap_pchange(int a, HEAP h, int pos, int key_s){
while(pos >= 1 && h->key[parent(pos)] < key_s){
    h->key[pos] = h->key[parent(pos)];
    h->v[pos] = h->v[parent(pos)];
    pos = parent(pos);
}
h->key[pos] = key_s;
h->v[pos] = h->v[parent(pos)];
heapify(h, pos);
return;
}
















