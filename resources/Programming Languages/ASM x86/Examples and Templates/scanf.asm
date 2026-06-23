dieci equ 10
.model small
.stack
.data
.code
.startup
mov bx, 10 ;acquisisci un numero n cifre
xor cx, cx
get:
push ax
xor ax, ax
mov ah, 01h
int 21h
mov cl, al
cmp cl, 0dh
jz next
xor ah, ah

pop ax
mul bx

sub cl, '0'
add ax, cx
jmp get

next:       ;stampa numero
mov dl,3
mov ah, 2
int 21h

pop ax
xor cx, cx

put:
div bx
inc cx
push dx
xor dx, dx
cmp ax, 0
jz print
jmp put

print:
pop dx
add dl, '0'
mov ah, 2
int 21h
loop print
.exit
end

