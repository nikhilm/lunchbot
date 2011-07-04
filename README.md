Lunchbot
========

When I was interning at Mozilla in the summer of 2011, there were about 40 interns
spread over 3 floors of the office. We often wanted different types of lunch at different
times, but there was no easy way to co-ordinate this on IRC. Lunchbot tries to solve
this problem.

How
---

All commands require you to explicitly mention lunchbot at the beginning of the line,
either as 'lunchbot:' or 'lunchbot'

1) ask everyone in channel for lunch
- ask everyone

2) ask ops for lunch (At mozilla, all current interns have ops)
- ask ops

3) express interest in lunch
- i [want/would like/need/desperate for] lunch
- i [am/will be] hungry

once you do this you will be pinged for lunch regardless of you signing up for alarms
or exclusion.

4) create a lunch time and ping everyone interested at that time (this is pretty useless without options)
- lunch at HH:MM [+options] [message]
eg. lunch at 12:30 at Le Boulanger

Options:

* +invite <names> - automatically ping all <names> (space separated nicks) at that time
* +exclusive - no one else can sign up for this lunch and it won't show up when anyone not in +invite runs command (5)

5) view lunch times
- lunches

6) signup for a lunch time
- signup for HH:MM

You will be pinged 5 minutes before the time.

7) disable notifications
- had lunch
  full
  not hungry

disable all lunch notifications, including any you have manually signed up for.
NOTE: there is no way to undo this for now, so be careful.

8) reset (useful for the next day)
- rollover <password>
  requires a password so that only one responsible person can initiate day change.

lunchbot does NOT handle time zones, it better be in the same physical location as everyone else.

Installation
------------

License
-------
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
Version 2, December 2004

Copyright (C) 2011 Nikhil Marathe <nsm.nikhil@gmail.com>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.

(Attribution is appreciated :))

Authors
-------
Nikhil Marathe <nsm.nikhil@gmail.com>
