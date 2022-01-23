import { Injectable } from '@angular/core';
import { Articles } from '../models/articles.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {  BehaviorSubject,Subject } from 'rxjs';
import { map } from 'rxjs/operators';;
import { environment } from '../../../environments/environment';

const BackendURL=environment.apiURL+'/post';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private articles:Articles[]=[];
  private articleUpdate=new Subject<Articles[]>(); 
  public err = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient,private router: Router) { }

  getArticleUpdateListener() {
    return this.articleUpdate.asObservable();
  }

  addArticle(postData:Articles){
    this.http.post<{message:string;responsedata:Articles}>(BackendURL,postData)
    .subscribe((responsedata)=>{
      this.err.next(null);
      this.router.navigate(['/']);
    }),
    (err:any)=>{this.err.next(err)};
  }
  getArticles(){
    this.http
    .get<{ messege: string; allpost: Articles[] }>(BackendURL)
    .pipe(
      map((alldata) => {
        return alldata.allpost.map((post: any) => {
          return {
            id:post._id,
            title: post.title,
            body: post.body,
            image: post.image,
            createrid: post.createrid,
            creatername: post.creatername,
            createdAt: post.createdAt,
            like: post.like,
            isActive: post.isActive,
          };
        });
      })
    )
    .subscribe(
      (transformedPosts) => {
        this.err.next(null);
        this.articles = transformedPosts;
        this.articleUpdate.next([...this.articles]);
      },
      (err) => {
        this.err.next(err);
      }
    );
  }
  getArticle(id: any){
    console.log(id);
    return this.http.get<{ message: string; post: any }>(
      BackendURL + `/${id}`
    );
  }
  updateArticle(updatedData: Articles) {
    const Articleid = updatedData.id;
    this.http
      .patch<{ message: string,id:string }>(BackendURL + `/${Articleid}`, updatedData)
      .subscribe((responseData) => {
        this.err.next(null);
        this.router.navigate(['/articles']);
      }),
      (err: any) => {
        this.err.next(err);
      };
  }
  deleteArticle(id: string) {
    this.http.delete(BackendURL + `/${id}`).subscribe(
      (data) => {
        this.err.next(null);
        const updatedPosts = this.articles.filter(
          (article) => article.id !== id
        );
        this.articles = updatedPosts;
        this.articleUpdate.next([...this.articles]);
        this.router.navigate(['/']);
      },
      (e) => {
        this.err.next(e);
      }
    );
  }
}
