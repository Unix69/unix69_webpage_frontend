typedef struct bst *BST;


BST BST_init();
int BST_search(BST b, int k);
int BST_min(BST b);
int BST_max(BST b);
void BST_insert_leaf(BST b, int x);
void BST_insert_leaf(BST b, int x);
void BST_insert_root(BST b, int x);
void BST_inorder(BST b);
void BST_preorder(BST b);
void BST_postorder(BST b);
