@echo off
set filename=pubpal-dev %date% %time%
set filename=%filename:/=-%
set filename=%filename: =__%
set filename=%filename:.=_%
set filename=%filename::=-%
REM Export the database
echo Running backup "%filename%"
REM Export the database
echo Running backup pubpal-dev
cd C:\Program Files\MongoDB\Server\4.0\bin 
set filepath=C:\Program Files\MongoDB\Server\4.0\backups
set finalpath=%filepath%%filename%
echo saving to %finalpath%
mongodump --db pubpal-dev --out %filepath%
echo BACKUP COMPLETE
pause
