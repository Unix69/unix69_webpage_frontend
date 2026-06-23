#include <stdlib.h>
#include <stdio.h>
#include "st.h"
#define key(a) a

struct st{
int *v;
int *f;
int size;
int max;
};

ST init(int x){
    int i;
ST s = malloc(sizeof(ST));
s->v = malloc(x*sizeof(int*));
s->f = malloc(x*sizeof(int*));
for(i = 0; i < x; s->f[i] = 0, s->v[i] = -1, i++);
s->size = 0;
s->max = x;
return(s);
}


void fill_st(int x, ST s){
s->v[key(x)] = x;
s->f[key(x)]++;
s->size ++;
return;
}


void delete_st(int x, ST s){
if(s->f[key(x)] != 0){
if(s->f[key(x)] == 1){
s->v[key(x)] = -1;
}
s->f[key(x)] --;
s->size --;
}
return;
}

void display_st(ST s){
    printf("\n\n");
    int i = 0;
for(; i < s->max; i++){
    if(s->v[i] != -1)
      printf("item %d freq %d pos %d\n", s->v[i], s->f[i], i);
    }
return;
}

int search_st(ST s, int x){
    if(s->v[key(x)] != -1)
    printf("item %d freq %d", s->v[key(x)], s->f[key(x)]);
    return(s->v[key(x)]);
}

int search_st_pos(int pos, ST s){
    int i = 0;
    while(pos > 0 && i < s->max){
        if(s->v[i] != -1)
        pos --;
        i++;}
        i--;

   if(pos == 0)
      return(s->v[i]);
        else
          return -1;
   }

int count_st(ST s){return(s->size);}








