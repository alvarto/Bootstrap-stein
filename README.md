# Bootstrap-stein, with [Demo here](http://alvarto.github.io/Bootstrap-stein/)

A bootstrap theme. And some UI resolution about management system.

## "Stein" the Theme

This theme is inspired by stacks of sheets. Colors are limited to active controls and things of importance. Thus leaning towards better focus.

To compile this theme successfully, you need to move `source/less/variables.less` to `source/less/bootstrap/variables.less` , or to make a soft link.

### Dependencies of the theme

- Bootstrap 3.3.4
- Font Awesome 4.3.0
- jQuery 1.11.2

## Large table display

When you display a super large table, usual means to freeze table top/left section might fail due to 2-way overflow direction. This demo shows how to tear a table down to 1-way scrolling by simply providing column-hiding functionality.

### Technics

- Dynamic `<style>` inject
- String-based template (Minimun Implementation)

