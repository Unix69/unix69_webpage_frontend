int init(int **val, int **sol, int **mark);
int disp_semplici(int *val, int *sol, int *mark, int n, int count, int pos);
void sol_display(int *sol, int count);
void sol_display_powerset(int *sol, int *val, int n);
int disp_rip(int *val, int *sol, int n, int count, int pos);
void power_set(int *val, int *sol, int n, int pos);
void powerset_pruning(int *mark, int *val, int pos, int n, int tot, int x, int psum);
int promising(int *val, int tot, int x, int psum, int pos);
