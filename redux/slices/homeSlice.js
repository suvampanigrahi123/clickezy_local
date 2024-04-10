import {createSlice} from '@reduxjs/toolkit'


const homeSlice=createSlice({
    name:'home',
    initialState:{
        relatePhotos:[],
        galleryPhotos:[],
        categories:[],
        serviceLoading:false
    },
    reducers:{
        setServiceDataLoading:(state,{payload})=>{
            state.serviceLoading=true
        },
        setRelatePhotosSuccess:(state,{payload})=>{
            state.relatePhotos=payload
            state.serviceLoading=false
        },
        setGallerPhotosSuccess:(state,{payload})=>{
            state.galleryPhotos=payload
            state.serviceLoading=false
        },
        setServiceDataFail:(state,{payload})=>{
            state.serviceLoading=false

        },
        setCategoriesDetails:(state,{payload})=>{
            state.categories=payload
        }
    }
})

export default homeSlice.reducer
export const {setCategoriesDetails,setGallerPhotosSuccess,setRelatePhotosSuccess,setServiceDataFail,setServiceDataLoading} = homeSlice.actions