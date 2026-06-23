typedef struct hash_table *HASH;


HASH init_h();
int ascii_convert(char a);
int hash_str(int M, char *str);
void hash_fill_str_linear(char *str, HASH h);
int hash_str_clone(char *str, int M);
void hash_fill_int_quadratic(char *str, HASH h);
void hash_fill_str_double(char *str, HASH h);
char *hash_search_str_double(char *str, HASH h);
char *hash_search_int_quadratic(char *str, HASH h);
char *hash_search_str_linear(char *str, HASH h);
void hash_delete_str_linear(char *str, HASH h);
void free_hash_int(HASH h);
void display_hash_int(HASH h);


