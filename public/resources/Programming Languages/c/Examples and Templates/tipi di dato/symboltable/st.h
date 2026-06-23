typedef struct st *ST;

ST init(int x);
void fill_st(int x, ST s);
void delete_st(int x, ST s);
void display_st(ST s);
int count_st(ST s);
int search_st(ST s, int x);
int search_st_pos(int pos, ST s);
