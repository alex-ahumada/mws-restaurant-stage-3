"use strict";var gulp=require("gulp"),plugins=require("gulp-load-plugins")(),runSequence=require("run-sequence"),watchify=require("watchify"),browserify=require("browserify"),uglifyify=require("uglifyify"),mergeStream=require("merge-stream"),source=require("vinyl-source-stream"),buffer=require("vinyl-buffer"),babelify=require("babelify"),browserSync=require("browser-sync"),reload=browserSync.reload;function createBundler(e){var r;return(r=plugins.util.env.production?browserify():browserify({cache:{},packageCache:{},fullPaths:!0,debug:!0})).transform(babelify.configure({stage:1})),plugins.util.env.production&&r.transform({global:!0},"uglifyify"),r.add(e),r}function bundle(e,r){var u=r.split("/"),i=u[u.length-1],n=u.slice(0,-1).join("/");return e.bundle().on("error",plugins.util.log.bind(plugins.util,"Browserify Error")).pipe(source(i)).pipe(buffer()).pipe(plugins.sourcemaps.init({loadMaps:!0})).pipe(plugins.sourcemaps.write("./")).pipe(plugins.size({gzip:!0,title:i})).pipe(gulp.dest("dist/"+n)).pipe(reload({stream:!0}))}gulp.task("clean",function(e){require("del")(["dist"],e)}),gulp.task("copy-lib",function(){return gulp.src(["lib/idb.js"]).pipe(gulp.dest("dist")).pipe(reload({stream:!0}))}),gulp.task("copy",function(){return gulp.src(["test/index.html","node_modules/mocha/mocha.css","node_modules/mocha/mocha.js"]).pipe(gulp.dest("dist/test")).pipe(reload({stream:!0}))});var bundlers={"test/idb.js":createBundler("./test/idb.js")};gulp.task("js",function(){return mergeStream.apply(null,Object.keys(bundlers).map(function(e){return bundle(bundlers[e],e)}))}),gulp.task("browser-sync",function(){browserSync({notify:!1,port:8e3,server:"dist",open:!1})}),gulp.task("watch",function(){gulp.watch(["test/index.html"],["copy"]),gulp.watch(["lib/idb.js"],["copy-lib"]),Object.keys(bundlers).forEach(function(e){var r=watchify(bundlers[e]);r.on("update",function(){return bundle(r,e)}),bundle(r,e)})}),gulp.task("build",function(e){runSequence("clean",["copy","js","copy-lib"],e)}),gulp.task("default",["build"]),gulp.task("serve",function(e){runSequence("clean",["copy","js","copy-lib"],["browser-sync","watch"],e)});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlkYi9ndWxwZmlsZS5qcyJdLCJuYW1lcyI6WyJndWxwIiwicmVxdWlyZSIsInBsdWdpbnMiLCJydW5TZXF1ZW5jZSIsIndhdGNoaWZ5IiwiYnJvd3NlcmlmeSIsInVnbGlmeWlmeSIsIm1lcmdlU3RyZWFtIiwic291cmNlIiwiYnVmZmVyIiwiYnJvd3NlclN5bmMiLCJiIiwic3JjIiwiY2FjaGUiLCJ1dGlsIiwiZW52IiwicHJvZHVjdGlvbiIsInN0YWdlIiwicGFja2FnZUNhY2hlIiwiZnVsbFBhdGhzIiwiZGVidWciLCJ0cmFuc2Zvcm0iLCJiYWJlbGlmeSIsImNvbmZpZ3VyZSIsImdsb2JhbCIsImFkZCIsIm91dHB1dERpciIsImJ1bmRsZSIsInBpcGUiLCJzb3VyY2VtYXBzIiwid3JpdGUiLCJzaXplIiwic3BsaXRQYXRoIiwidGl0bGUiLCJvdXRwdXRGaWxlIiwic2xpY2UiLCJqb2luIiwiYnVuZGxlcnMiLCJvbiIsImxvZyIsImJpbmQiLCJ0YXNrIiwiaW5pdCIsIk9iamVjdCIsImtleSIsImd6aXAiLCJkZXN0IiwicmVsb2FkIiwic3RyZWFtIiwiZG9uZSIsIm5vdGlmeSIsInBvcnQiLCJjcmVhdGVCdW5kbGVyIiwiYXBwbHkiLCJrZXlzIiwibWFwIiwid2F0Y2hpZnlCdW5kbGVyIiwib3BlbiIsIndhdGNoIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6ImFBQUEsSUFBSUEsS0FBT0MsUUFBUSxRQUNmQyxRQUFVRCxRQUFRLG9CQUFSQSxHQURWRCxZQUFPQyxRQUFYLGdCQUNJQyxTQUFVRCxRQUFRLFlBQ2xCRSxXQUFBQSxRQUFjRixjQUNkRyxVQUFXSCxRQUFRLGFBQ25CSSxZQUFhSixRQUFRLGdCQUNyQkssT0FBQUEsUUFBWUwsdUJBQ1pNLE9BQUFBLFFBQWNOLGdCQUNkTyxTQUFTUCxRQUFRLFlBQ2pCUSxZQUFTUixRQUFRLGdCQUVqQlMsT0FBQUEsWUFBY1QsT0ErQmRVLFNBQUlOLGNBQVdPLEdBQ2JDLElBQUFBLEVBZ0JKLE9BYkNGLEVBSkNULFFBQUFZLEtBQUFDLElBQUFDLFdBSURYLGFBR0NZLFdBQU8sQ0FEVEosTUFBQSxHQUFBSyxhQUFBLEdBQUFDLFdBQUEsRUFKSUMsT0FBTyxLQVNHQyxVQUVUQyxTQUZIQyxVQUFBLENBR0ROLE1BQUEsS0FHRGYsUUFBQVksS0FBQUMsSUFBQUMsWUFDREwsRUFBQVUsVUFBQSxDQU5LRyxRQUFRLEdBUWQsYUFHRWIsRUFBQWMsSUFBSUMsR0FOR2YsRUFRQSxTQUVEZ0IsT0FBU3pCLEVBQVFZLEdBRmhCLElBTUpjLEVBQWFDLEVBQVdDLE1BQU0sS0FDOUJGLEVBQWFHLEVBQWFDLEVBQU1DLE9BQU9DLEdBRzNDUixFQUFBTSxFQUFBRyxNQUFBLEdBQUEsR0FBQUMsS0FBQSxLQUVELE9BQUlDLEVBQVdWLFNBQWZXLEdBQUEsUUFBQXBDLFFBQUFZLEtBQUF5QixJQUFBQyxLQUFBdEMsUUFBQVksS0FBQSxxQkFUS2MsS0FBS3BCLE9BQU8wQixJQWFaTyxLQUFLaEMsVUFDUm1CLEtBQU9yQixRQUFBQSxXQUFrQm1DLEtBQ3ZCQyxDQUFBQSxVQUFZTixLQUNWVCxLQUFBMUIsUUFBY21DLFdBQVNPLE1BQU1BLE9BRmpDaEIsS0FBQTFCLFFBQUE2QixLQUFBLENBQUFjLE1BQUEsRUFBQVosTUFBQUMsS0FERk4sS0FBQTVCLEtBQUE4QyxLQUFBLFFBQUFwQixJQVBLRSxLQUFLbUIsT0FBTyxDQUFFQyxRQUFRLEtBL0QzQmhELEtBQUkrQyxLQUFBQSxRQUFTckMsU0FBWXFDLEdBR3ZCOUMsUUFBUSxNQUFSQSxDQUFlLENBQUMsUUFBU2dELEtBQzFCakQsS0FGRHlDLEtBQUEsV0FBQSxXQUtFLE9BQU96QyxLQUFLWSxJQUFJLENBRGxCWixlQUNFNEIsS0FBTzVCLEtBQUtZLEtBQ1YsU0FGSmdCLEtBQUFtQixPQUFBLENBQUFDLFFBQUEsT0FRRWhELEtBQUF5QyxLQUFPekMsT0FBUyxXQURsQixPQUFBQSxLQUFBWSxJQUFBLENBRUksa0JBT0osK0JBQ0UsZ0NBTEdnQixLQUFLNUIsS0FBSzhDLEtBQUssY0FPbEJsQixLQUFJMUIsT0FBUVksQ0FBUmtDLFFBQWlCaEMsT0F1RG5Ca0MsSUFBQUEsU0FBUSxDQUNSQyxjQUZVQyxjQUFBLGtCQUFBcEQsS0FBWnlDLEtBQUEsS0FBQSxXQURGLE9BQUFsQyxZQUFBOEMsTUFBQSxLQU5JVixPQUFPVyxLQUFLakIsVUFBVWtCLElBQUksU0FBU1gsR0FlbENILE9BQUtkLE9BQVNVLFNBQUFPLEdBQVlBLFFBSzNCNUMsS0FBQXlDLEtBQUllLGVBQWtCcEQsV0FDdEJvRCxZQUFBQSxDQUNFTixRQUFBLEVBQ0RDLEtBRkQsSUFHQXhCLE9BQU82QixPQUxUQyxNQUFBLE1BVUF0RCxLQUFBQSxLQUFBQSxRQUFZLFdBRGRILEtBQUEwRCxNQUFBLENBQUEsbUJBQUEsQ0FBQSxTQVhFMUQsS0FBSzBELE1BQU0sQ0FBQyxjQUFlLENBQUMsYUFFNUJmLE9BQU9XLEtBQUtqQixVQUFVc0IsUUFBUSxTQUFTZixHQWV6QzVDLElBQUt5QyxFQUFjckMsU0FBZ0JpQyxTQUFBTyxJQUNqQ3pDLEVBQVltQyxHQUFTLFNBQVMsV0FEaEMsT0FBQVgsT0FBQTZCLEVBQUFaLEtBVklqQixPQUFPNkIsRUFBaUJaLE9BSTVCNUMsS0FBS3lDLEtBQUssUUFBUyxTQUFVUSxHQUMzQjlDLFlBQVksUUFBUyxDQUFDLE9BQVEsS0FBTSxZQUFhOEMsS0FHbkRqRCxLQUFLeUMsS0FBSyxVQUFXLENBQUMsVUFFdEJ6QyxLQUFLeUMsS0FBSyxRQUFTLFNBQVVRLEdBQzNCOUMsWUFBWSxRQUFTLENBQUMsT0FBUSxLQUFNLFlBQWEsQ0FBQyxlQUFnQixTQUFVOEMiLCJmaWxlIjoiaWRiL2d1bHBmaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGd1bHAgPSByZXF1aXJlKCdndWxwJyk7XG52YXIgcGx1Z2lucyA9IHJlcXVpcmUoJ2d1bHAtbG9hZC1wbHVnaW5zJykoKTtcbnZhciBydW5TZXF1ZW5jZSA9IHJlcXVpcmUoJ3J1bi1zZXF1ZW5jZScpO1xudmFyIHdhdGNoaWZ5ID0gcmVxdWlyZSgnd2F0Y2hpZnknKTtcbnZhciBicm93c2VyaWZ5ID0gcmVxdWlyZSgnYnJvd3NlcmlmeScpO1xudmFyIHVnbGlmeWlmeSA9IHJlcXVpcmUoJ3VnbGlmeWlmeScpO1xudmFyIG1lcmdlU3RyZWFtID0gcmVxdWlyZSgnbWVyZ2Utc3RyZWFtJyk7XG52YXIgc291cmNlID0gcmVxdWlyZSgndmlueWwtc291cmNlLXN0cmVhbScpO1xudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ3ZpbnlsLWJ1ZmZlcicpO1xudmFyIGJhYmVsaWZ5ID0gcmVxdWlyZSgnYmFiZWxpZnknKTtcbnZhciBicm93c2VyU3luYyA9IHJlcXVpcmUoJ2Jyb3dzZXItc3luYycpO1xuXG52YXIgcmVsb2FkID0gYnJvd3NlclN5bmMucmVsb2FkO1xuXG5ndWxwLnRhc2soJ2NsZWFuJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgcmVxdWlyZSgnZGVsJykoWydkaXN0J10sIGRvbmUpO1xufSk7XG5cbmd1bHAudGFzaygnY29weS1saWInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGd1bHAuc3JjKFtcbiAgICAnbGliL2lkYi5qcydcbiAgXSkucGlwZShndWxwLmRlc3QoJ2Rpc3QnKSlcbiAgICAucGlwZShyZWxvYWQoe3N0cmVhbTogdHJ1ZX0pKTtcbn0pO1xuXG5ndWxwLnRhc2soJ2NvcHknLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGd1bHAuc3JjKFtcbiAgICAndGVzdC9pbmRleC5odG1sJyxcbiAgICAnbm9kZV9tb2R1bGVzL21vY2hhL21vY2hhLmNzcycsXG4gICAgJ25vZGVfbW9kdWxlcy9tb2NoYS9tb2NoYS5qcydcbiAgXSkucGlwZShndWxwLmRlc3QoJ2Rpc3QvdGVzdCcpKVxuICAgIC5waXBlKHJlbG9hZCh7c3RyZWFtOiB0cnVlfSkpO1xufSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1bmRsZXIoc3JjKSB7XG4gIHZhciBiO1xuXG4gIGlmIChwbHVnaW5zLnV0aWwuZW52LnByb2R1Y3Rpb24pIHtcbiAgICBiID0gYnJvd3NlcmlmeSgpO1xuICB9XG4gIGVsc2Uge1xuICAgIGIgPSBicm93c2VyaWZ5KHtcbiAgICAgIGNhY2hlOiB7fSwgcGFja2FnZUNhY2hlOiB7fSwgZnVsbFBhdGhzOiB0cnVlLFxuICAgICAgZGVidWc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGIudHJhbnNmb3JtKGJhYmVsaWZ5LmNvbmZpZ3VyZSh7XG4gICAgc3RhZ2U6IDFcbiAgfSkpO1xuXG4gIGlmIChwbHVnaW5zLnV0aWwuZW52LnByb2R1Y3Rpb24pIHtcbiAgICBiLnRyYW5zZm9ybSh7XG4gICAgICBnbG9iYWw6IHRydWVcbiAgICB9LCAndWdsaWZ5aWZ5Jyk7XG4gIH1cblxuICBiLmFkZChzcmMpO1xuICByZXR1cm4gYjtcbn1cblxuZnVuY3Rpb24gYnVuZGxlKGJ1bmRsZXIsIG91dHB1dFBhdGgpIHtcbiAgdmFyIHNwbGl0UGF0aCA9IG91dHB1dFBhdGguc3BsaXQoJy8nKTtcbiAgdmFyIG91dHB1dEZpbGUgPSBzcGxpdFBhdGhbc3BsaXRQYXRoLmxlbmd0aCAtIDFdO1xuICB2YXIgb3V0cHV0RGlyID0gc3BsaXRQYXRoLnNsaWNlKDAsIC0xKS5qb2luKCcvJyk7XG5cbiAgcmV0dXJuIGJ1bmRsZXIuYnVuZGxlKClcbiAgICAvLyBsb2cgZXJyb3JzIGlmIHRoZXkgaGFwcGVuXG4gICAgLm9uKCdlcnJvcicsIHBsdWdpbnMudXRpbC5sb2cuYmluZChwbHVnaW5zLnV0aWwsICdCcm93c2VyaWZ5IEVycm9yJykpXG4gICAgLnBpcGUoc291cmNlKG91dHB1dEZpbGUpKVxuICAgIC5waXBlKGJ1ZmZlcigpKVxuICAgIC5waXBlKHBsdWdpbnMuc291cmNlbWFwcy5pbml0KHsgbG9hZE1hcHM6IHRydWUgfSkpIC8vIGxvYWRzIG1hcCBmcm9tIGJyb3dzZXJpZnkgZmlsZVxuICAgIC5waXBlKHBsdWdpbnMuc291cmNlbWFwcy53cml0ZSgnLi8nKSkgLy8gd3JpdGVzIC5tYXAgZmlsZVxuICAgIC5waXBlKHBsdWdpbnMuc2l6ZSh7IGd6aXA6IHRydWUsIHRpdGxlOiBvdXRwdXRGaWxlIH0pKVxuICAgIC5waXBlKGd1bHAuZGVzdCgnZGlzdC8nICsgb3V0cHV0RGlyKSlcbiAgICAucGlwZShyZWxvYWQoeyBzdHJlYW06IHRydWUgfSkpO1xufVxuXG52YXIgYnVuZGxlcnMgPSB7XG4gICd0ZXN0L2lkYi5qcyc6IGNyZWF0ZUJ1bmRsZXIoJy4vdGVzdC9pZGIuanMnKVxufTtcblxuZ3VscC50YXNrKCdqcycsIGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG1lcmdlU3RyZWFtLmFwcGx5KG51bGwsXG4gICAgT2JqZWN0LmtleXMoYnVuZGxlcnMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBidW5kbGUoYnVuZGxlcnNba2V5XSwga2V5KTtcbiAgICB9KVxuICApO1xufSk7XG5cbmd1bHAudGFzaygnYnJvd3Nlci1zeW5jJywgZnVuY3Rpb24oKSB7XG4gIGJyb3dzZXJTeW5jKHtcbiAgICBub3RpZnk6IGZhbHNlLFxuICAgIHBvcnQ6IDgwMDAsXG4gICAgc2VydmVyOiBcImRpc3RcIixcbiAgICBvcGVuOiBmYWxzZVxuICB9KTtcbn0pO1xuXG5ndWxwLnRhc2soJ3dhdGNoJywgZnVuY3Rpb24gKCkge1xuICBndWxwLndhdGNoKFsndGVzdC9pbmRleC5odG1sJ10sIFsnY29weSddKTtcbiAgZ3VscC53YXRjaChbJ2xpYi9pZGIuanMnXSwgWydjb3B5LWxpYiddKTtcblxuICBPYmplY3Qua2V5cyhidW5kbGVycykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgd2F0Y2hpZnlCdW5kbGVyID0gd2F0Y2hpZnkoYnVuZGxlcnNba2V5XSk7XG4gICAgd2F0Y2hpZnlCdW5kbGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBidW5kbGUod2F0Y2hpZnlCdW5kbGVyLCBrZXkpO1xuICAgIH0pO1xuICAgIGJ1bmRsZSh3YXRjaGlmeUJ1bmRsZXIsIGtleSk7XG4gIH0pO1xufSk7XG5cbmd1bHAudGFzaygnYnVpbGQnLCBmdW5jdGlvbiAoZG9uZSkge1xuICBydW5TZXF1ZW5jZSgnY2xlYW4nLCBbJ2NvcHknLCAnanMnLCAnY29weS1saWInXSwgZG9uZSk7XG59KTtcblxuZ3VscC50YXNrKCdkZWZhdWx0JywgWydidWlsZCddKTtcblxuZ3VscC50YXNrKCdzZXJ2ZScsIGZ1bmN0aW9uIChkb25lKSB7XG4gIHJ1blNlcXVlbmNlKCdjbGVhbicsIFsnY29weScsICdqcycsICdjb3B5LWxpYiddLCBbJ2Jyb3dzZXItc3luYycsICd3YXRjaCddLCBkb25lKTtcbn0pO1xuIl19
