typedef struct Stack *STACK;
STACK INIT(int maxn);
void Push(STACK sp, int ele);
int Pop(STACK sp);
int Empty(STACK sp);
int Full(STACK sp);
void Free(STACK sp);
int Free_node(STACK sp, int ele);

