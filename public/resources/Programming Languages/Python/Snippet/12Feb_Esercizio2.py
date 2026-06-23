def verify_dates(day1: int = 1, month1: int = 1, year1: int = 1900, day2: int = 2, month2: int = 1, year2: int = 1900):
    #corpo della funzione
    result = None
    
    if year1 > year2:
        result = 1
    elif year1 < year2:
        result = -1
    elif year1 == year2:
        if month1 > month2:
            result = 1
        elif month1 < month2:
            result = -1
        elif month1 == month2:
            if day1 > day2:
                result = 1
            elif day1 < day2:
                result = -1
            elif day1 == day2:
                result = 0
    return result

date1_day = int(input("Inserire il giorno della prima data "))
date1_month = int(input("Inserire il mese della prima data "))
date1_year = int(input("Inserire l'anno della prima data "))

#
#if isinstance(date1_day, int):
#    print("Date1_day e' un intero")
#else:
#    print("Date1_day NON e' un intero")
    

date2_day = int(input("Inserire il giorno della seconda data "))
date2_month = int(input("Inserire il mese della seconda data "))
date2_year = int(input("Inserire l'anno della seconda data "))


print(f"Date 1 -> {date1_day}/{date1_month}/{date1_year}")
print(f"Date 2 -> {date2_day}/{date2_month}/{date2_year}")

result = verify_dates()
    
#result = verify_dates(day1=date1_month, month1=date1_month, year1=date1_year,
#                      day2=date2_day, month2=date2_month, year2=date2_year)


#result = verify_dates(date1_day, date1_month, date1_year, date2_day, date2_month, date2_year)

print(f"Result = {result}")

if result == 1:
    print("Data1 viene dopo Data2")
elif result == -1:
    print("Data1 viene prima di Data2")
else:
    print("Data1 uguale a Data2")
    




