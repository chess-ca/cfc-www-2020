+++
title = "Tools - Swiss Assistant"
layout = "ws-single"
+++

_Swiss Assistant_ was built for the specific purpose of building the reports that need
to be sent to the CFC for ratings.  It does not do pairings, only the reports.
Therefore, it is much simpler than the pairings software.
For online tournaments, where the platform does the pairings, _Swiss Assistant_
is ideal. If you are already an expert and more comfortable with one of the pairing softwares,
keep using it if you prefer.

## Downloads
* Download [Swiss Assistant Sofware](https://storage.googleapis.com/cfc-public/files/SwissAssistant2.zip).
* Download [Database of CFC Members](https://storage.googleapis.com/cfc-public/data/cfcmembers.mde).
  This is updated weekly (usually Wednesdays) so download the latest.

## Install Tips
* The download file is a .zip file. When unzipped, it will create a directory called
  "SwissAssistant2". Go into that directory. Double-click on the executable,
  "SwissAssistant2.exe" to start the application.
* Some Anti-Virus software installed on your PC may not like an executable file (.exe)
  inside of a .zip file.  We cannot help your resolve that.  You may need to temporarily
  disable your Anti-Virus download while you download this one file from the CFC server
  (located on Google Cloud Storage).

## Usage Tips
* Start by setting the number of players, number of rounds, and type of
  tournament (swiss, round robin, double round robin).
* Instead of entering player data yourself, it's much easier to use a database.
  Download it, then open it with options `Database` > `Open database ...`.
  Click to select a row in the results table (left side); search for players
  (right side top; enter name or CFC id); double-click the found player and
  the info will be copied to the results table.  Easy!
* Enter results as
  * For Swiss tournaments:
    * "W7" for a win vs player #7
    * "D14" for a draw vs player #14
    * "L1" for a loss vs player #1
    * "L0" for a 0 point bye
    * "D0" for a 1/2 point bye
    * "W0" for a 1 point bye
  * For Round Robin tournaments, in the cross table:
    * "1", "=", "0" for a win, draw, loss.
    * "W0" for an un-rated win by default.
    * "L0" for an un-rated loss by default.
* To create reports, click the `Create report for CFC...` button
  (the menu option doesn't seem to work).
* Explore! There are other nifty features.
