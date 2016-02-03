module StringUtils 
    ( hexString8
    , hexString16
    , hexString32 ) where 

import Text.Printf

-- This is horrible
hexString :: Int -> Int -> String 
hexString c x = printf formatString x
    where formatString = "0x%0" ++ (show c) ++ "x" 

hexString8 :: Int -> String 
hexString8 = hexString 2

hexString16 :: Int -> String
hexString16 = hexString 4

hexString32 :: Int -> String
hexString32 = hexString 8

hexString64 :: Int -> String 
hexString64 = hexString 16

