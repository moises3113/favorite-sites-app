const express = require('express')
const { link } = require('fs')
const router = express.Router()

const pool = require('../database')
const {isLoggedIn} = require('../lib/auth')

router.get('/add', isLoggedIn, (req,res)=>{
    res.render('links/add')
})

router.post('/add', isLoggedIn, async (req,res)=>{
    const {title, url, description} = req.body
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    await pool.query('insert into links set ?', [newLink])
    req.flash('success','Link saved correctly!')
    res.redirect('/links')
})

router.get('/', isLoggedIn, async (req,res)=>{
    const links = await pool.query('select * from links where user_id = ?',[req.user.id])
    res.render('links/list', { links })
})

router.get('/delete/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params
    await pool.query('delete from links where id=?', [id])
    req.flash('success','Link removed correctly!')
    res.redirect('/links')
})

router.get('/edit/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params
    const link = await pool.query('select * from links where id=?', [id])
    res.render('links/edit', { link:link[0] })
})

router.post('/edit/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params
    const {title, url, description} = req.body
    const updatedLink = {
        title,
        url,
        description
    }
    await pool.query('update links set ? where id=?', [updatedLink, id])
    req.flash('success','Link edited correctly!')
    res.redirect('/links')
})

module.exports= router