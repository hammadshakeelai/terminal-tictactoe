def print_octothrope(one,two,three,four,five,six,seven,eight,nine):
    print("       *       *      ","\n","   ",one,"   *   ",two,"   *   ",three,"   ","\n","       *       *      ","\n","* * * * * * * * * * * *","\n","       *       *      ","\n","   ",four,"   *   ",five,"   *   ",six,"   ","\n","       *       *      ","\n","* * * * * * * * * * * *","\n","       *       *      ","\n","   ",seven,"   *   ",eight,"   *   ",nine,"   ","\n","       *       *      ",sep="")
def main():
    one = two = three = four = five = six = seven = eight = nine = " "
    
    print("1 | 2 | 3","---------","4 | 5 | 6","---------","7 | 8 | 9",sep="\n")
    list=[]
    for i  in range(9):
        turn=0
        if i%2==0:
            symbol="x"
            j=1
        else:
            symbol="o"
            j=2
        while turn<1 or turn>9:
            turn=float(input(f"user{j}: enter which cell do you want to mark ; "))
            turn=int(turn)
            if turn in list:
                turn=0
            else:
                list.append(turn)
        if turn==1:
            one=symbol
        elif turn==2:
            two=symbol
        elif turn==3:
            three=symbol
        elif turn==4:
            four=symbol
        elif turn==5:
            five=symbol
        elif turn==6:
            six=symbol
        elif turn==7:
            seven=symbol
        elif turn==8:
            eight=symbol
        elif turn==9:
            nine=symbol
            
        print_octothrope(one,two,three,four,five,six,seven,eight,nine)
        if one=="x" and two=="x" and three=="x" or four=="x" and five=="x" and six=="x" or seven=="x" and eight=="x" and nine=="x" or one=="x" and four=="x" and seven=="x" or two=="x" and five=="x" and eight=="x" or three=="x" and six=="x" and nine=="x" or one=="x" and five=="x" and nine=="x" or three=="x" and five=="x" and seven=="x":
            print("user1 won")
            win="yes"
            break
        elif one=="o" and two=="o" and three=="o" or four=="o" and five=="o" and six=="o" or seven=="o" and eight=="o" and nine=="o" or one=="o" and four=="o" and seven=="o" or two=="o" and five=="o" and eight=="o" or three=="o" and six=="o" and nine=="o" or one=="o" and five=="o" and nine=="o" or three=="o" and five=="o" and seven=="o":
            print("user2 won")
            win="yes"
            break 
        else:
            win="no"
    if win!="yes":
        print("DRAW")
    print(list)
while True:       
    main()
    