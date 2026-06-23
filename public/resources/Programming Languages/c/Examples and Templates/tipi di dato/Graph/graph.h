typedef struct graph *GRAPH;

int **mat_init(int r, int c, int val);
GRAPH graph_init(int v);
void graph_show(GRAPH g);
GRAPH graph_read_file(FILE *fp);
int pathR(GRAPH g, int v, int w);
int graph_path(GRAPH g, int v, int w);
int pathH(GRAPH g, int v, int w, int d);
int graph_path_ham(GRAPH g, int v, int w);
void graph_dfs(GRAPH g);
void graph_bfs(GRAPH g);
void dfsRcc(GRAPH g, int v, int id);
int graph_cc(GRAPH g);
GRAPH graph_reverse(GRAPH g);
int graph_scc(GRAPH g);
void sccdfsR(GRAPH g, int w);
int Ufind(int p, int q);
void Uinit(int n);
int find_q(int p);
void quick_union(int p, int q);
void graph_mst_Kruscal(GRAPH g);
void graph_mst_Prim(GRAPH g);


