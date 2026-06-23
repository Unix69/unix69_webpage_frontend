#include <stdlib.h>
#include <stdio.h>
#include "BST.h"
#define NULLnode NULL
typedef struct nodo *link;

struct nodo{
link r;
link l;
int x;
};

struct bst{
link head;
int n;
link z;
};
link insert_leaf(link h, int x, link z);
link new_node(int n, link l, link r);
link rotR(link h);
link rotL(link h);
link insert_root(link h, int x, link z);
int search_max(link h, link z);
int search_min(link h, link z);
int search_k(link h, int k, link z);
void in_order(link h, link z);
void pre_order(link h, link z);
void post_order(link h, link z);

link new_node(int n, link l, link r){
link a = malloc(sizeof(link));
a->x = n;
a->r = r;
a->l = l;
return(a);
}

BST BST_init(){
BST b = malloc(sizeof(BST));
b->n = 0;
b->head = b->z = new_node(-1, NULLnode, NULLnode);
return(b);
}

int BST_search(BST b, int k){
    return(search_k(b->head, k, b->z));
    }

int search_k(link h, int k, link z){
    if(h == z)
        return(0);
    if(k == h->x)
        return(h->x);
    if(k < h->x)
        return(search_k(h->l, k, z));
    else
        return(search_k(h->r, k, z));
}

int BST_min(BST b){
    return(search_min(b->head, b->z));
    }

int BST_max(BST b){
    return(search_max(b->head, b->z));
    }


int search_max(link h, link z){
if(h == z)
    return(0);
    if(h->r == z)
       return(h->x);
       return(search_max(h->r, z));
  }



int search_min(link h, link z){
if(h == z)
    return(0);
    if(h->l == z)
       return(h->x);
       return(search_max(h->l, z));
}

void BST_insert_leaf(BST b, int x){
b->head = insert_leaf(b->head, x, b->z);
b->n ++;
return;
}


link insert_leaf(link h, int x, link z){
if(h == z)
   return(new_node(x, NULLnode, NULLnode));
if(x > h->x)
    h->r = insert_leaf(h->r, x, z);
else
    h->l = insert_leaf(h->l, x, z);
return(h);
}

link rotR(link h){
link x = h->l;
h->l = x->r;
x->r = h;
return(x);
}

link rotL(link h){
link x = h->r;
h->r = x->l;
x->l = h;
return(x);
}



void BST_insert_root(BST b, int x){
b->head = insert_root(b->head, x, b->z);
b->n ++;
}

link insert_root(link h, int x, link z){
if(h == z)
    return(new_node(x, NULLnode, NULLnode));
    if(x < h->x){
    h->l = insert_root(h->l, x, z);
    h = rotR(h);
    }
    else{
        h->r = insert_root(h->r, x, z);
        h = rotL(h);
        }
        return(h);
}

void in_order(link h, link z){
    if(h == z)
    return;
     in_order(h->l, z);
     printf("%d", h->x);
     in_order(h->r, z);
    return;
}



void BST_inorder(BST b){
    in_order(b->head, b->z);
    return;
    }


void pre_order(link h, link z){
    if(h == z)
    return;
     printf("%d", h->x);
     pre_order(h->l, z);
     pre_order(h->r, z);
    return;
}

void BST_preorder(BST b){
    in_order(b->head, b->z);
    return;
    }


void post_order(link h, link z){
    if(h == z)
    return;
    post_order(h->l, z);
    post_order(h->r, z);
    printf("%d", h->x);
    return;
}


void BST_postorder(BST b){
    in_order(b->head, b->z);
    return;
    }

