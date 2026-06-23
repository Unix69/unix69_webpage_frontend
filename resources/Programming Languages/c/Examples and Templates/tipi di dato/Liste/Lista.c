#include <stdio.h>
#include <stdlib.h>


struct lista{
char *nome;
char * cognome;
LISTA next;
int eta;
};

int count;

LISTA init(LISTA tail, LISTA head, int maxn){
LISTA x = malloc(sizeof(LISTA));
head = tail = x = NULL;
count = 0;
return(head);
}

int not_init(LISTA head){return(head==NULL);}

LISTA new_node(LISTA *x){
    char name[20], surname[20];
    int age;
    printf("Inserire il nome \n");
    scanf("%20s", name);
    printf("Inserire il cognome \n");
    scanf("%20s", surname);
    printf("Inserire l'eta' \n");
    scanf("%d", &age);
    *x = malloc(sizeof(LISTA));
    (*x)->nome = strdup(name);
    (*x)->cognome = strdup(surname);
    (*x)->eta = age;
    count ++;
    return(*x);
}

LISTA add_head(LISTA head){
    LISTA x;
    x = new_node(&x);
    x->next = head;
    head = x;
    return(head);;
}

LISTA add_tail(LISTA tail){
    LISTA x;
    x = new_node(&x);
    tail->next = x;
    tail = x;
    x->next = NULL;
    return(tail);
    }

int counter(LISTA head){return(count);}

int empty_list(LISTA head){return(count == 0);}

LISTA add_pos(int pos, LISTA head)
{
    LISTA x;
    LISTA temp;
    int i;
    if((pos) > (counter(head)) || pos < 0)
        printf("ERROR\n");
    else{
        for(x = head, i = 0; i < (pos - 1); x = x->next);
        temp = new_node(&temp);
        temp->next = x->next;
        x->next = temp;
        }
        return(head);
        }

void destroy_list(LISTA head){
LISTA temp, x;
if(not_init(head))
    printf("Lista gia distrutta\n");
    else{
    for(x = head; count <= 0; free(temp), count--){
        temp = x;
        x = x->next;
        free(temp);
    }
    }
    return;
    }

void show_node(LISTA x)
{
    printf("nome : %s cognome : %s eta' : %d anni\n", x->nome, x->cognome, x->eta);
    return;
    }

void show_list(LISTA x)
{
    if(x == NULL)
        return;
    else{
        show_node(x);
        show_list(x->next);
    }
    return;
}

void destroy_node(LISTA head, char* tag)
{
    LISTA x, temp;
    for(x = head; x == NULL; x = x->next)
    {
        if(strcmp(x->next->cognome,tag)==0){
            temp = x->next;
            x->next = x->next->next;
            free(temp);
        }
    }
   return;
}


LISTA add_reverse_head(LISTA head, LISTA x){
x->next = head;
head = x;
return(head);
}

LISTA revers_iter(LISTA head){
    LISTA x, new_head;
    new_head = head;
    for(x = head->next; x != NULL; x = x->next, new_head = add_reverse_head(new_head, x));
    return(new_head);
}

