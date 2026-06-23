#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include "ht_str.h"
#define MAXn 100
#define maxSTR 30
#define c1 2
#define c2 3

struct hash_table{
char **v;
int size;
int n;
};


HASH init_h(){
HASH h = malloc(sizeof(HASH));
int i;
h->v = malloc(2*MAXn*sizeof(char*));
h->size = 2*MAXn;
h->n = 0;
for(i = 0; i < h->size; i++){
    h->v[i] = malloc(maxSTR*sizeof(char));
    strncpy(h->v[i], "z", 1);
    }
return(h);
}

int full(int i, HASH h){return(strncmp(h->v[i], "z", 1) && h->v[i][1] == '\0');}

int hash_str(int M, char *str){
int h = 0;
int base = 128;
for( ;*str!= '\0'; str++)
    h = (h*base + *str) % M;
return(h);
}


int ascii_convert(char a){return((int)a);}

void hash_fill_str_linear(char *str, HASH h){
int i = hash_str(h->size, str);
while(full(i, h))
    i = (i + 1) % h->size;
strncpy(h->v[i], str, strlen(str));
h->n ++;
return;
}


int hash_str_clone(char *str, int M){
    int h = 0;
    int base = 128;
    for( ;*str!= '\0'; str++)
    h = (int)(((h*base + *str)*3)/5.27) % M;
    return(h);
    }

void hash_fill_int_quadratic(char *str, HASH h){
int index = hash_str(h->size, str);
while(full(index, h))
    index = (index * (c1 + index*c2))%h->size;
strncpy(h->v[index], str, strlen(str));
h->n ++;
return;
}

void hash_fill_str_double(char *str, HASH h){
int i = hash_str(h->size, str);
while(full(i, h))
    i = (i + hash_str_clone(str, h->size)) % h->size;
strncpy(h->v[i], str, strlen(str));
h->n ++;
return;
}


char *hash_search_str_double(char *str, HASH h){
int i = hash_str(h->size, str);
while(full(i, h)){
    if(strcmp(h->v[i], str))
        return(str);
    else
        i = (i + hash_str_clone(str, h->size)) % h->size;
    }
return("z");
}


char *hash_search_int_quadratic(char *str, HASH h){
int index = hash_str(h->size, str);
while(full(index, h)){
    if(strcmp(h->v[index], str))
    return(str);
      else
        index = (index * (c1 + index*c2))%h->size;
       }
return("z");
}

char *hash_search_str_linear(char *str, HASH h){
int i = hash_str(h->size, str);
while(full(i, h)){
    if(strcmp(h->v[i], str))
      return(str);
        else
           i = (i + 1) % h->size;
    }
return("z");
}


void hash_delete_str_linear(char *str, HASH h){
int i = hash_str(h->size, str);
int j;
while(full(i, h)){
    if(strcmp(h->v[i], str)){
        h->n --;
      break;
    }
        else
           i = (i + 1) % h->size;
    }
    strncpy(h->v[i], "z", 1);
    while(full(i, h)){
        j = i;
        i = (i + 1) % h->size;
        strncpy(h->v[j], h->v[i], strlen(h->v[i]));
        }
return;
}


void free_hash_int(HASH h){
    int i = 0;
    for(; i < h->size; i++)
        free(h->v[i]);
        free(h->v);
        free(h);
}

void display_hash_int(HASH h){
int i;
for(i = 0; i < h->size; i++){
    if(full(i, h))
        printf("\np%d %s", i, (h->v[i]));
    }
}











