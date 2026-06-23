#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "ht_int.h"
#define MAXn 100
#define c1 2
#define c2 3

struct hash_table{
int *v;
int size;
int n;
};


HASH init_h(){
HASH h = malloc(sizeof(HASH));
int i;
h->v = malloc(2*MAXn*sizeof(int));
h->size = 2*MAXn;
h->n = 0;
for(i = 0; i < 2*MAXn; i++)
    h->v[i] = -1;
return(h);
}

int hash_int_a(int M, int k){return(k * (int)((sqrt(5) - 1) / 2) % M);}
int hash_int_b(int M, int k){return(k % M);}
int ascii_convert(char a){return((int)a);}

void hash_fill_int_linear(int x, HASH h){
int i = hash_int_a(h->size ,x);
while(h->v[i] != -1)
    i = (i + 1) % h->size;
h->v[i] = x;
h->n ++;
return;
}

void hash_fill_int_quadratic(int x, HASH h){
int index = hash_int_a(h->size ,x);
while(h->v[index] != -1)
    index = (index * (c1 + index*c2))%h->size;
h->v[index] = x;
h->n ++;
return;
}

void hash_fill_int_double(int x, HASH h){
int i = hash_int_a(h->size ,x);
while(h->v[i] != -1)
    i = (i + hash_int_b(h->size, x)) % h->size;
h->v[i] = x;
h->n ++;
return;
}


int hash_search_int_double(int x, HASH h){
int i = hash_int_a(h->size ,x);
while(h->v[i] != -1){
    if(h->v[i] == x)
        return(x);
    else
        i = (i + hash_int_b(h->size, x)) % h->size;
    }

return(-1);
}


int hash_search_int_quadratic(int x, HASH h){
int index = hash_int_a(h->size ,x);
while(h->v[index] != -1){
    if(h->v[index] == x)
    return(x);
      else
        index = (index * (c1 + index*c2))%h->size;
       }
return(-1);
}

int hash_search_int_linear(int x, HASH h){
int i = hash_int_a(h->size ,x);
while(h->v[i] != -1){
    if(h->v[i] == x)
      return(x);
        else
           i = (i + 1) % h->size;
    }
return(-1);
}


void hash_delete_int_linear(int x, HASH h){
int i = hash_int_a(h->size ,x);
int j;
while(h->v[i] != -1){
    if(h->v[i] == x){
        h->n --;
      break;
    }
        else
           i = (i + 1) % h->size;
    }
    h->v[i] = 0;
    while(h->v[i] != -1){
        j = i;
        i = (i + 1) % h->size;
        h->v[j] = h->v[i];
        }
return;
}


void free_hash_int(HASH h){
        free(h->v);
    free(h);
}

void display_hash_int(HASH h){
int i;
for(i = 0; i < h->size; i++){
    if(h->v[i] != -1)
        printf("\np%d %d", i, (h->v[i]));
    }
}








