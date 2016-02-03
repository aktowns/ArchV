module Lib 
    ( writeProgram
    , testProgram ) where

import StringUtils (hexString8, hexString16, hexString32) 

import Data.List   (intercalate)
import Data.Bits

import Text.ParserCombinators.Parsec

data Register = GP1 | GP2 | GP3 | GP4 | GP5 | GP6 | GP7 | GP8 | GP9 | ERR | EIP | SP | ZF  

data OperandArg = Ptr Int 
                | Reg Register 
                | Val Int

newtype Operand = Operand (String, [OperandArg]) 

newtype Program = Program [Operand] 

class ToArchVBinary a where
    toBinary :: a -> Int

instance Show Register where 
    show GP1 = "gp1"
    show GP2 = "gp2" 
    show GP3 = "gp3" 
    show GP4 = "gp4"
    show GP5 = "gp4"
    show GP6 = "gp4"
    show GP7 = "gp4"
    show GP8 = "gp4"
    show GP9 = "gp4"
    show ERR = "err" 
    show EIP = "eip"
    show SP  = "sp"
    show ZF  = "zf"

instance Show ReceivingType where 
    show (Ptr x) = "*" ++ (hexString32 x) 
    show (Reg x) = "$" ++ (show x)
    show (Val x) = "v" ++ (hexString32 x)

instance Show Operand where 
    show (Operand (name, args)) = name ++ " " ++ intercalate ", " (map show args) 

instance Show Program where 
    show (Program ops) = intercalate "\n" (map show ops)

instance ToArchVBinary Register where 
    toBinary GP1 = 0x0a 
    toBinary GP2 = 0x0b 
    toBinary GP3 = 0x0c 
    toBinary GP4 = 0x0d 
    toBinary GP5 = 0x0e 
    toBinary GP6 = 0x0f 
    toBinary GP7 = 0x10 
    toBinary GP8 = 0x11
    toBinary GP9 = 0x12
    toBinary ERR = 0x13
    toBinary EIP = 0x14 
    toBinary SP  = 0x15

instance ToArchVBinary Operand where 
    toBinary (Operand ("nop", []))                = 0x00
    toBinary (Operand ("movr8", [Reg l, Reg r]))  = (0x01 `shift` 8 .|. (toBinary l)) `shift` 8 .|. (toBinary r)
    toBinary (Operand ("movmr8", [Reg l, Ptr r])) = 0 
    toBinary (Operand ("hlt", []))                = 0x0a
    toBinary _                                    = 0

readHex :: GenParser Char st Char 
readHex = (string "0x") >> (many (number <|> (anyOf "abcdef")))  

readOp :: GenParser Char st String 
readOp = many (noneOf " \n")

readRegister :: GenParser Char st OperandArg 
readRegister = (char '$') >> (many (letter <|> number))  

readPtr :: GenParser Char st OperandArg
readPtr = (char '*') >> (string "0x") >> (many 
readHex :: GenParser Char st OperandArg

readOpArgs :: GenParser Char st [OperandArg]
readOpArgs = many (readOp <|> readRegister <|> readPtr)

testProgram :: Program
testProgram = Program [ Operand ("movr8", [Reg $ GP1, Reg $ GP2]),
                        Operand ("movr8", [Reg $ GP2, Reg $ GP3]) ]

-- Takes a program consisting of a list of operands 
-- looks up the opcodes and returns the result an 
-- array of hex values 
writeProgram :: Program -> [Int]
writeProgram (Program prog) = map toBinary prog

someFunc :: IO ()
someFunc = putStrLn "someFunc"
