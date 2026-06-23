#include <stdio.h>
#include <stdlib.h>
#define MAX 40
#define MDB 1

struct corrente{int r;int c;};
struct out{int ro;int co;};
struct in{int ri;int ci;};
struct pos{struct in start;struct out exit;};
int init(char ***L, FILE *fp, struct pos *p);
void stampa_lab(char **l);
int mossa(struct pos p, struct corrente peppe, char **l, int ric);
struct corrente sposta(struct corrente peppe, int i, char **l);
int nr, nc;

int init(char ***L, FILE *fp, struct pos *p){

int i = 0;
fscanf(fp, "%d %d\n\n", &nr, &nc);

if(nr > MAX && nc > MAX){
    printf("Dimensione tabella del file troppo grande");
return 0;
}

*L=malloc(nr*sizeof(char**));
for(; i< nr; (*L)[i++] = malloc((nc+1)*sizeof(char*)));
i = 0;

while(i < nr)
    fgets((*L)[i++], MAX, fp);

printf("\n\nInserire coordinate iniziali di riga e colonna (forma umana)\n");
scanf("%d %d", &(p->start.ri), &(p->start.ci));
printf("\n\nInserire coordinate finali di riga e colonna (forma umana)\n");
scanf("%d %d", &(p->exit.ro), &(p->exit.co));

p->exit.ro --; p->exit.co --;
p->start.ri --; p->start.ci --;

return 1;
}

void stampa_lab(char **l){
int i;
for(i = 0; i < nr; i ++)
printf("%s", l[i]);
printf("\n\n");
}


struct corrente sposta(struct corrente peppe, int i, char **l){

int spr[4] = {0, 1, -1, 0};
int spc[4] = {1, 0, 0, -1};
int r = peppe.r + spr[i];
int c = peppe.c + spc[i];
if(r >= 0 && c >= 0 && c < nc && r < nr){
    if(l[r][c] != '|' && (l[r][c] < '0' || l[r][c] > '9')){
 peppe.r = r;
 peppe.c = c;
 }
 }
 return(peppe);
}




int mossa(struct pos p, struct corrente peppe, char **l, int ric){
    int i = 0;
    struct corrente pino;
    int risultato;
    printf("R(%d)\n", ric);
    if(p.exit.ro == peppe.r && p.exit.co == peppe.c){
        risultato = 1;
        return(risultato);
        }
        else
            for(i = 0; i < 4; i++){
                pino = sposta(peppe, i, l);
                if(peppe.c != pino.c || peppe.r != pino.r){
                    ric ++;
                    #if MDB
                    getch();
                    printf("pino.r %d, pino.c %d\n\n", pino.c, pino.r);
                    #endif
                    l[pino.r][pino.c] = (char)('0' + ric%10);
                    stampa_lab(l);
                    risultato = mossa(p, pino, l, ric);
                    if(risultato == 1){break;}
                    else{
                        getch();
                        l[pino.r][pino.c] = (char)('x');
                        ric --;
                        printf("R(%d)\n", ric);
                        stampa_lab(l);
                    }
                }
              }
        }




int main()
{
    struct pos posizione;
    struct corrente peppe;
    FILE *fp;
    int risultato;
    char **L;
    int ric = 0;
    fp = fopen("Labirinto.txt", "r");
    if(init(&L, fp, &posizione) == 0)
        return  -1;
        fclose(fp);
    peppe.r = posizione.start.ri;
    peppe.c = posizione.start.ci;
    risultato = mossa(posizione, peppe, L, ric);
    if(risultato == 0)
        printf("\n\nSoluzione non trovata !!\n");
        else
            printf("\n\nVittoria !\n\n");
            return 0;
}
