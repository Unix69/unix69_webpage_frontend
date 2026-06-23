PORTA  EQU 80h
PORTB  EQU PORTA+1
PORTC  EQU PORTA+2
CTRL   EQU PORTA+3
delay 100
a equ 97
z equ 122
.model small    
.stack
.data
.code
.startup
mov dx, CTRL               
mov al, 1001100b
mov cx, delay
out dx. al
attend:loop attend
mov dx, PORTC
in al, dx
mov cx, 1000*delay

ciclo: in bl, dx  
test bl,00000001b
je continue
jmp go
continue:
test al, 00000001b
jne chiama
jmp go
chiama:
push al
push dx 
call IO 
pop dx
pop al
go: mov al, bl

loop ciclo
jmp fine  
  
  
  
IO PROC
mov dx, PORTA
in al, dx

test1: cmp al, 'a'
jnb test2
jmp dopo
test2 : cmp al, 'z'
jna superato
jmp dopo

superato:
sub al, 32
mov dx, PORTB
out dx, al 
attend:loop attend
dopo:
RET
IO ENDP

fine:
.exit
end