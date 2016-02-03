; count.asm 
; example app that counts to 20, this app needs to be loaded at 0x00001000.

movr8 0x01, $gp3 ; set gp3 to 1, to be used to increment our counter
movr8 0x14, $gp4 ; set gp4 to 20, so set the upper limit of our loop
cmpr $gp1, $gp4  ; is gp1 == gp4
jz *0x00001030   ; if so jump to hlt
addr $gp1, $gp3  ; if not add 1 to our counter
jmp *0x00001010  ; and jump back to cmpr
hlt              ; fin.
