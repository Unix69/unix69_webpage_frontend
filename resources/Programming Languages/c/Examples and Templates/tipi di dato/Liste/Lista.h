#include <stdio.h>
#include <stdlib.h>
#include <stdlib.h>
typedef struct lista *LISTA;

LISTA init(LISTA *tail, LISTA *head, int maxn);
LISTA add_head(LISTA *head);
int not_init(LISTA head);
LISTA new_node(LISTA *x);
LISTA add_tail(LISTA *tail);
int counter(LISTA head);
LISTA add_pos(int pos, LISTA *head);
void destroy_list(LISTA *head);
void show_node(LISTA x);
void show_list(LISTA x);
void destroy_node(LISTA head, char* tag);
LISTA revers_iter(LISTA head);
LISTA add_reverse_head(LISTA head, LISTA x);
