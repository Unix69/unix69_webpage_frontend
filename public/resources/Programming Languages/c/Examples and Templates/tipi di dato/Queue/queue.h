typedef struct coda *QUEUE;
QUEUE INIT(int maxn);
void Put(QUEUE q, int ele);
int Get(QUEUE q);
int Empty(QUEUE q);
int Full(QUEUE q);
void Free_Queue(QUEUE q);
int Free_node(QUEUE q, int ele);


