#include <stdio.h>
#include <math.h>

int alphabets[26] = {0, };
char word[10][9];
int n;

int partition(int left, int right){
    int pivot = alphabets[left];
    int i = left, j = right, tmp;

    while(i < j){
        while(pivot < alphabets[j]) j--;
        while(i < j && pivot >= alphabets[i]) i++;
        tmp = alphabets[j];
        alphabets[j] = alphabets[i];
        alphabets[i] = tmp;
    }
    
    alphabets[left] = alphabets[i];
    alphabets[i] = pivot;

    return i;
}

void quick_sort(int left, int right){
    if(left >= right) return;

    int pivot = partition(left, right);
    quick_sort(left, pivot - 1);
    quick_sort(pivot + 1, right);
}

int main(int argc, char *argv[]){
    int answer = 0;
    int count = 0;

    scanf("%d", &n);
    for(int i=0; i<n; i++) scanf("%s", word[i]);

    for(int i=0; i<n; i++){
        count = 0;
        for(int j=8; j>=0; j--){
            if(word[i][j] == '\0') continue;
            alphabets[word[i][j] - 65] += (int) round(pow((double) 10, (double) count));
            count++;
        }
    }

    quick_sort(0, 25);
    
    for(int i=25; i>=13; i--) answer += alphabets[i] * (9 - 25 + i);
    printf("%d", answer);

    return 0;
}
