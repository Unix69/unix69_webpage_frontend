dieci equ 10
.model small
.stack
.data
.code
.startup
mov bx, 10
xor cx, cx
ciclo:

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
jmp ciclo

next:
pop ax
.exit
end

