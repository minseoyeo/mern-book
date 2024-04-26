import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import About from './pages/About';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import CreateReview from './pages/CreateReview';
import ReviewPage from './pages/ReviewPage';
import UpdateReview from './pages/UpdateReview';
import ScrollToTop from './components/ScrollToTop';
import UserReviews from './pages/UserReviews';
import Reviews from './pages/Reviews';
import Search from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/reviews' element={<Reviews/>}/>

        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/create-review' element={<CreateReview/>}/>
          <Route path='/update-review/:reviewId' element={<UpdateReview/>}/>
        </Route>
        <Route path='/review/:reviewSlug' element={<ReviewPage/>}/>
        <Route path='/:userId' element={<UserReviews/>}/>
      </Routes>
    </BrowserRouter>
  )
}
