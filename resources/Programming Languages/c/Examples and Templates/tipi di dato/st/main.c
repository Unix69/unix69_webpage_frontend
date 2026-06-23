#include <stdio.h>
#include <stdlib.h>
#include "st.h"


int main()
{
const int dim = 20;
ST tabella;
int x;
int i;
tabella = init(dim);
for(i = 0; i < 10; i++){
printf("\nInserire il dato in tabella\n");
scanf("%d", &x);
fill_st(x, tabella);
}
display_st(tabella);
printf("\nInserire elemento da eliminare\n");
scanf("%d", &x);
delete_st(x, tabella);
display_st(tabella);
    return 0;
}
