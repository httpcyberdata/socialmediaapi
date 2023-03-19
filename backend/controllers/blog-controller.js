import Blog from '../model/Blog';
import User from '../model/User';
import mongoose from 'mongoose';
export const getAllBlogs = async(req, res, next) => {
	let blogs;
	try {
		blogs = await Blog.find();
	} catch(err) {
		return console.log(err)
	}
	if(!blogs) {
		return res.status(404).json({
			message: "No Blogs Found"
		})
	}
	return res.status(200).json({
		blogs
	})
}

export const addBlog = async (req, res, next) => {
	const { title, description, image, user } = req.body;

	let existingUser;
	try {
		existingUser = await User.findById(user);
	} catch (err) { 
		return console.log(err);
	}

	if(!existingUser) {
		return res.status(400).json({
			message: "Unable to find user by this ID"
		})
	}

	const blog = new Blog({
		title,
		description,
		image,
		user
	})

	try {
		const session = await mongoose.startSession();
		session.startTransaction();
			await blog.save();
			existingUser.blogs.push(blog);
			await existingUser.save();
		await session.commitTransaction();
	} catch(err) {
		console.log(500);
		return res.status(500).json({ message: err })
	}

	return res.status(200).json({
		blog
	})
}

export const updateBlog = async (req, res, next) => {
	const { title, description } = req.body;
	const blogId = req.params.id;
	let blog;
	try {
		blog = await Blog.findByIdAndUpdate(blogId, {
			title,
			description,
		})
	} catch(err) {
		return console.log(err);
	}
	if(!blog) {
		return res.status(500).json({
			message: "Unable to update the blog"
		})
	}
	return res.status(200).json({blog})
}

export const getById = async (req, res, next) => {
	const id = req.params.id;
	let blog;
	try {
		blog = await Blog.findById(id);
	} catch (err) {
		return console.log(err);
	}
	if(!blog) {
		return res.status(404).json({ 
			message: 'No blog found'
		})
	}
	return res.status(200).json({
		blog
	})
}

export const deleteBlog = async (req, res, next) => {
	const id = req.params.id;
	let blog;
	try {
		blog = await Blog.findByIdAndRemove(id).populate('user');
		await blog.user.blogs.pull(blog);
		await blog.user.save();
	} catch(err) {

	}
	if(!blog) {
		return res.status(500).json({
			message: "Unable to Delete"
		})
	}
	return res.status(200).json({ 
		message: "Successfully deleted"
	})
}