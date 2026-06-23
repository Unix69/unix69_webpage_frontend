//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                              //  GRAPH.C
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


#include <stdio.h>
#include <stdlib.h>
#include "graph.h"
#include "queue.h"
#define maxWT 30

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                              //Dichiarazione variabili statiche
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 static int *mindist;
 static int *wt;
 static int *fr;
 static int *prev;
 static int *post;
 static int *st;
 static int *visited;
 static int *post0;
 static int *id;
 static int *size;
 static int time;
 static int time0;
 static int time1;

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                              //Dichiarazione funzioni e tipi di dato
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

typedef struct edge EDGE;

static EDGE edge_0(int a, int b);
static void graph_p(GRAPH g, int *st, int *wt);
static int graph_mst(EDGE *a, EDGE **mst, int d, GRAPH g);
static void bfs(GRAPH g, EDGE e);
static void dfsR(GRAPH g, EDGE e);
static void graph_insert(GRAPH g, EDGE e);
static void graph_edge_remove(GRAPH g, EDGE e);
static int graph_edges(GRAPH g, EDGE **a);
static GRAPH graph_carge_edges(EDGE *e, int c, int v);

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                              //Strutture dati
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


struct edge{
int v;
int w;
};

struct graph{
int n;
int e;
int **adj;
int *cc;
int *scc;
};


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                              //Funzioni (codice)
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


static EDGE edge_0(int a, int b){
EDGE e;
e.v = a;
e.w = b;
return(e);
}

int **mat_init(int r, int c, int val){
int i, j;
int **t = malloc(r*sizeof(int *));
for(i = 0; i < r; i++)
    t[i] = malloc(c*sizeof(int));
for(i = 0; i < r; i++)
    for(j = 0; j < c; j++)
       t[i][j] = val;
return(t);
}

GRAPH graph_init(int v){
 GRAPH g = malloc(sizeof(GRAPH));
 g->n = v;
 g->e = 0;
 g->adj = mat_init(v, v, 0);
 return(g);
}

void graph_insert(GRAPH g, EDGE e){
int v = e.v;
int w = e.w;
if(g->adj[v][w] == 0)
    g->e ++;
    g->adj[v][w] = 1;
    g->adj[w][v] = 1; // <-- grafi non orientati
return;
}

static void graph_edge_remove(GRAPH g, EDGE e){
int v = e.v;
int w = e.w;
if(g->adj[v][w] != 0)
    g->e --;
    g->adj[v][w] = 0;
    g->adj[w][v] = 0; // <-- grafo non orientato
}

static int graph_edges(GRAPH g, EDGE **a){
int v, w, e = 0;
for(v = 0; v < g->n; v++)
        for(w = v+1; w < g->n; w++)
        if(g->adj[v][w] != 0)
        (*a)[e++] = edge_0(v, w);
return(e);
}

void graph_show(GRAPH g){
int i, j;
system("cls");
printf("\n\n%d vertici %d archi\n\n", g->n, g->e);
for(i = 0; i < g->n; i++){
    for(j = 0; j < g->n; j++)
    printf("%d ", g->adj[i][j]);
    printf("\n");
    }
    return;
}

static GRAPH graph_carge_edges(EDGE *e, int c, int v){
int i = 0;
GRAPH g = graph_init(v);
g->e = c;
for(; i < c; i++)
  g->adj[e[i].v][e[i].w] = 1;
 return(g);
}

GRAPH graph_read_file(FILE *fp){
int a, b, i = 0;
fscanf(fp, "%d %d\n", &a , &b);
EDGE *e = malloc(a*sizeof(EDGE));
while(fscanf(fp, "%d %d\n", &e[i].v, &e[i].w) != EOF)
    i++;
GRAPH g = graph_carge_edges(e, a, b);
return(g);
}

int pathR(GRAPH g, int v, int w){
int t;
if(v == w)
    return 1;
    visited[v] = 1;
    for(t = 0; t < g->n; t++){
        if(g->adj[v][t] != 0)
           if(visited[t] == 0)
              if(pathR(g, t, w))
                 printf("(%d %d) \n", v, t);
                     return 1;
                     }
                     return 0;
                     }

int graph_path(GRAPH g, int v, int w){
    int t;
    visited = malloc((g->n)*sizeof(int));
    for(t = 0; t < g->n; t++)
        visited[t] = 0;
    return(pathR(g, v, w));
}

int pathH(GRAPH g, int v, int w, int d){
int t;
if(v == w){
    if(d == 0)
    return 1;
    else return 0;
    }
    visited[v] = 1;
    for(t = 0; t < g->n; t++){
        if(g->adj[v][t] != 0)
           if(visited[t] == 0)
              if(pathH(g, t, w, d-1))
                 printf("(%d %d) \n", v, t);
                     return 1;
                     }
                     visited[v] = 0;
                     return 0;
                     }

int graph_path_ham(GRAPH g, int v, int w){
    int t;
    visited = malloc((g->n)*sizeof(int));
    for(t = 0; t < g->n; t++)
        visited[t] = 0;
    return(pathH(g, v, w, g->n -1));
}

void graph_dfs(GRAPH g){
    int i;
    time = 0;
    prev = malloc((g->n)*sizeof(int));
    post = malloc((g->n)*sizeof(int));
    st = malloc((g->n)*sizeof(int));
    for(i = 0; i < g->n; i++){
        st[i] = -1; post[i] = -1; prev[i] = -1;
    }

    for(i = 0; i < g->n; i++){
        if(prev[i] == -1)
        dfsR(g, edge_0(i,i));
        }

        printf("\n\nEND PROCESS\n\n");
        for(i = 0; i < g->n; i++)
        printf("\nvertice %d : %d pre-time %d post-time\n", i, prev[i], post[i]);
        for(i = 0; i < g->n; i++)
        printf("\npadre del vertice %d e' il vertice %d\n", i, st[i]);
        return;
}

static void dfsR(GRAPH g, EDGE e){
int i;
if(e.v != e.w)
    printf("arco (%d-%d) e' di tipo tree\n", e.v, e.w);
st[e.w] = e.v;
prev[e.w] = time ++;
for(i = 0; i < g->n; i++){
if(g->adj[e.w][i] != 0){
    if(prev[i] == -1)
        dfsR(g, edge_0(e.w, i));
     else if(post[i] == -1)
        printf("arco (%d-%d) e' di tipo back", e.w, i);
     else if(prev[i] > prev[e.w])
        printf("arco (%d-%d) e' di tipo forward", e.w, i);
     else
        printf("arco (%d-%d) e' di tipo cross", e.w, i);
    }
    post[e.w] = time++;
    }
}

void graph_bfs(GRAPH g){
int i;
time = 0;
for(i = 0; i < g->n; i++){
    prev[i] = -1; st[i] = -1;
    }
    bfs(g, edge_0(0, 0));
    printf("\n BFS\n");
    for(i = 0; i < g->n; i++)
        printf("padre %d e' %d", i, st[i]);
return;
}

static void bfs(GRAPH g, EDGE e){
    int i = 0;
    int r;
    int c;
    QUEUE q = INIT(20);
    if((r = Put(q, e.w)) == -1)
        return;
    while(!Empty(q))
        if(prev[c = Get(q)] == -1){
            prev[c] = time ++;
            st[c] = e.v;
           for(; i < g->n; i++)
            if(g->adj[c][i] != 0)
            if(prev[i] == -1)
            r = Put(q, i);
    }
}

void dfsRcc(GRAPH g, int v, int id){
    int i;
    g->cc[v] = id;
    for(i = 0; i < g->n; i++)
    if(g->adj[v][i] != 0)
        if(g->cc[i] == -1)
        dfsRcc(g, i, id);
}

int graph_cc(GRAPH g){
int i, id = 0;
g->cc = malloc(g->n * sizeof(int));

for(i = 0; i < g->n; i++)
g->cc[i] = -1;

for(i = 0; i < g->n; i++)
if(g->cc[i] == -1)
    dfsRcc(g, i, id);

printf("\ncomponenti connesse\n");
for(i = 0; i < g->n; i++)
    printf("nodo %d in componente %d", i, g->cc[i]);
return(id);
}

GRAPH graph_reverse(GRAPH g){
    GRAPH r = graph_init(g->n);
    int i, j;
    for(i = 0; i < g->n; i++)
    for(j = 0; j < g->n; j++)
    if(g->adj[i][j] != 0)
    graph_insert(r, edge_0(j, i));
    return(r);
}

int graph_scc(GRAPH g){
int i;
time0 = 0;
time1 = 0;
GRAPH r = graph_reverse(g);
g->scc = malloc(g->n * sizeof(int));
r->scc = malloc(g->n * sizeof(int));
post0 = malloc(g->n * sizeof(int));
for(i = 0; i < g->n; i++){
        r->scc[i] = -1;
        post[i] = 0;
        post0[i] = 0;
}
for(i = 0; i < g->n; i++)
    if(r->scc[i] == -1)
    sccdfsR(r, i);
time0 = 0;
time1 = 0;
for(i = 0; i < g->n; i++)
    g->scc[i] = -1;
for(i = 0; i < g->n; i++)
    post0[i] = post[i];
for(i = g->n; i >= 0; i--){
if(g->scc[post0[i]] == -1){
    sccdfsR(g, post0[i]);
    time1++;
}
}
printf("\nComponenti fortemente connesse\n");
for(i = 0; i < g->n; i++)
    printf("\n nodo %d in scc %d \n", i, g->scc[i]);
return time1;
}

void sccdfsR(GRAPH g, int w){
g->scc[w] = time1;
int i = 0;
for(i = 0; i < g->n; i++)
    if(g->adj[w][i] != 0)
        if(g->scc[i] == -1)
        sccdfsR(g, i);
        post[time0 ++] = w;
}

int Ufind(int p, int q){
    return(find_q(p) == find_q(q));
    }

void Uinit(int n){
int i = 0;
id = malloc(n*sizeof(int));
size = malloc(n*sizeof(int));
for(i = 0; i < n; i++){
    size[i] = 1;
    id[i] = i;
}
}

int find_q(int p){
while(p != id[p])
    p = id[p];
return(p);
}

void quick_union(int p, int q){
int i = find_q(p);
int j = find_q(q);

if(i == j)
    return;
else if(size[i] > size[j]){
    id[j] = i;
    size[i] += size[j];
    }
else{
    id[i] = j;
    size[j] += size[i];
    }
}

void graph_mst_Kruscal(GRAPH g){
EDGE *a = malloc(g->e*(sizeof(EDGE)));
int d = graph_edges(g, &a);
int i;
EDGE *mst = malloc(d*(sizeof(EDGE)));
int k = graph_mst(a, &mst, d, g);
printf("\n-----MST-----\n");
for(i = 0; i < k; i++)
printf("\n%d - %d", mst[i].v, mst[i].w);
return;
}

static int graph_mst(EDGE *a, EDGE **mst, int d, GRAPH g){
int k = 0;
int i = 0;
Uinit(g->n);
for(;i < d && k < (g->n - 1); i++){
    if(!Ufind(a[i].v, a[i].w)){
       quick_union(a[i].v, a[i].w);
       (*mst)[k++] = a[i];
       }
    }
return(k);
}

void graph_mst_Prim(GRAPH g){
int v;
wt = malloc(g->n * sizeof(int));
graph_p(g, st, wt);
printf("ST \n");
for(v = 0; v < g->n; v++)
printf("%3d", v);
printf("\n");
for(v = 0; v < g->n; v++)
printf("%3d", st[v]);
printf("\n");
printf("WT \n");
for(v = 0; v < g->n; v++)
printf("%3d", wt[v]);
printf("\n");
}

void graph_p(GRAPH g, int *st, int *wt){
int v, w, min;
for(v = 0; v < g->n; v++){
    st[v] = -1;
    fr[v] = v;
    wt[v] = maxWT;
}
st[0] = 0;
wt[0] = 0;
for(min = 0; min != g->n;){
    v = min;
    st[min] = fr[min];
    for(w = 0, min = g->n; w < g->n; w++){
    if(st[w] == -1){
        if(g->adj[v][w] < wt[w]){
            wt[w] = g->adj[w][w];
            fr[w] = v;
        }
        if(wt[w] < wt[min])
            min = w;
      }
    }
  }
}












