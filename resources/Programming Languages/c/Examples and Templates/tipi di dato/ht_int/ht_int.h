typedef struct hash_table *HASH;


HASH init_h();

int hash_int_b(int M, int k);
int hash_int_a(int M, int k);
int ascii_convert(char a);
void hash_fill_int_linear(int x, HASH h);
void hash_fill_int_quadratic(int x, HASH h);
void hash_fill_int_double(int x, HASH h);
int hash_search_int_double(int x, HASH h);
int hash_search_int_quadratic(int x, HASH h);
int hash_search_int_linear(int x, HASH h);
void hash_delete_int_linear(int x, HASH h);
void free_hash_int(HASH h);
void display_hash_int(HASH h);
