typedef struct heap *HEAP;


HEAP init(int maxn);
void fil(HEAP h, int a, int key_s);
void heapify(HEAP h, int i);
void swap_index(int a, int b, HEAP h);
void build_heap(HEAP h);
void heap_sort(HEAP h);
void PQ_heap_insert(HEAP h, int a, int key_s);
int PQ_heap_extract_max(HEAP h);
void PQ_heap_pchange(int a, HEAP h, int pos, int key_s);
int empty(HEAP h);


