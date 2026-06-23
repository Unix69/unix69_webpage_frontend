.model small
.stack
.data
mat dw 154, 123, 109, 86, 4, 0, 412, -23, -231, 9, 50, 0, 123, -24, 12, 55, -45, 0, 0, 0, 0, 0, 0, 0
.code
.startup
mov cx, 3  
mov si, offset mat
extr1:
xor ax, ax
push cx
mov cx, 5
extr2:
add ax,[si]
inc si
inc si
loop extr2
pop cx
mov [si], ax
inc si
inc si
loop extr1 
mov si, offset mat
mov cx, 6
extc1:
xor ax, ax
push si
push cx
mov cx, 3
extc2:
add ax, [si]
add si, 12
loop extc2
mov [si], ax
pop cx
pop si
inc si
inc si
loop extc1
.exit
end