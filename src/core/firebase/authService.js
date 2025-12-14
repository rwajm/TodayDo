import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    onAuthStateChanged,
    sendEmailVerification
} from 'firebase/auth';
import { auth } from './config';
import userService from './userService';

class AuthService {
    /**
     * 1단계: 이메일/비밀번호로 계정 생성 + 인증 메일 발송
     * (닉네임은 아직 설정하지 않음)
     */
    async createAccount(email, password) {
        try {
            console.log('create accout');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 이메일 인증 메일 발송
            await sendEmailVerification(user);
            console.log('✅ Verification email sent to:', email);

            return {
                uid: user.uid,
                email: user.email,
                emailVerified: false
            };
        } catch (error) {
            console.error('Create Account Error:', error);
            const errorMessage = this._handleAuthError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * 2단계: 이메일 인증 상태 확인
     */
    async checkEmailVerification() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('로그인이 필요합니다.');

            // Firebase에서 최신 상태 가져오기
            await user.reload();

            return user.emailVerified;
        } catch (error) {
            console.error('Check email verification error:', error);
            throw error;
        }
    }

    /**
     * 인증 이메일 재발송
     */
    async resendVerificationEmail() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('로그인이 필요합니다.');

            await user.reload();

            if (user.emailVerified) {
                throw new Error('이미 인증된 계정입니다.');
            }

            await sendEmailVerification(user);
            console.log('✅ Verification email resent');
        } catch (error) {
            console.error('Resend verification email error:', error);
            throw error;
        }
    }

    /**
     * 3단계: 닉네임 설정 + Firestore 프로필 생성
     * (이메일 인증 완료 후 호출)
     */
    async completeSignUp(nickname) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('로그인이 필요합니다.');

            // 최신 상태 확인
            await user.reload();

            if (!user.emailVerified) {
                throw new Error('이메일 인증이 필요합니다.');
            }

            // Firebase Auth 프로필 업데이트
            await updateProfile(user, {
                displayName: nickname
            });

            // Firestore에 사용자 프로필 생성
            await userService.createUserProfile(user.uid, user.email, nickname);

            // 이메일 인증 상태 업데이트
            await userService.updateEmailVerified(user.uid, true);

            const userData = {
                uid: user.uid,
                email: user.email,
                nickname: nickname,
                emailVerified: true
            };

            await signOut(auth);
            console.log('Sign up completed');

            return userData;

        } catch (error) {
            console.error('Complete SignUp Error:', error);
            throw error;
        }
    }
    
    /**
         * 로그인
         */
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firebase Auth의 최신 상태 가져오기
            await user.reload();

            // Firestore 프로필 가져오기
            let userProfile = await userService.getUserProfile(user.uid);

            // Firebase Auth와 Firestore 동기화
            if (user.emailVerified && !userProfile.emailVerified) {
                console.log('[Auth] Syncing emailVerified to Firestore...');
                await userService.updateEmailVerified(user.uid, true);

                // 업데이트가 완전히 반영될 때까지 재시도 (최대 5초)
                let attempts = 0;
                const maxAttempts = 10;
                while (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    userProfile = await userService.getUserProfile(user.uid);

                    if (userProfile.emailVerified) {
                        console.log('[Auth] emailVerified sync confirmed');
                        break;
                    }

                    attempts++;
                    console.log(`[Auth] Waiting for Firestore sync... (${attempts}/${maxAttempts})`);
                }

                if (!userProfile.emailVerified) {
                    console.warn('[Auth] Firestore sync timeout, but continuing...');
                }
            }

            return {
                uid: user.uid,
                email: user.email,
                nickname: userProfile.nickname,
                emailVerified: user.emailVerified,
                level: userProfile.level,
                exp: userProfile.exp,
                maxExp: userProfile.maxExp,
                title: userProfile.title
            };
        } catch (error) {
            console.error('SignIn Error:', error);
            const errorMessage = this._handleAuthError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * 로그아웃
     */
    async logOut() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('LogOut Error:', error);
            throw new Error('로그아웃에 실패했습니다.');
        }
    }

    /**
     * 비밀번호 재설정 이메일 전송
     */
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            console.error('Reset Password Error:', error);
            const errorMessage = this._handleAuthError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * 비밀번호 변경 (로그인 상태에서)
     */
    async changePassword(newPassword) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('로그인이 필요합니다.');

            await updatePassword(user, newPassword);
            console.log('✅ Password changed successfully');
        } catch (error) {
            console.error('Change Password Error:', error);
            const errorMessage = this._handleAuthError(error);
            throw new Error(errorMessage);
        }
    }

    /**
     * 현재 사용자 가져오기
     */
    getCurrentUser() {
        return auth.currentUser;
    }

    /**
     * 닉네임 업데이트 (Auth + Firestore)
     */
    async updateNickname(newNickname) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('로그인이 필요합니다.');

            // Auth displayName 업데이트
            await updateProfile(user, {
                displayName: newNickname
            });

            // Firestore 업데이트
            await userService.updateNickname(user.uid, newNickname);

            return {
                uid: user.uid,
                email: user.email,
                nickname: newNickname
            };
        } catch (error) {
            console.error('Update nickname error:', error);
            throw error;
        }
    }

    /**
     * 인증 상태 변경 리스너
     */
    onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }

    /**
     * 에러 처리
     */
    _handleAuthError(error) {
        const errorCode = error.code;

        switch (errorCode) {
            // 공통
            case 'auth/invalid-email':
                return '유효하지 않은 이메일 형식입니다.';
            case 'auth/missing-password':
                return '비밀번호를 입력해주세요.';

            // 회원가입 관련
            case 'auth/email-already-in-use':
                return '이미 사용 중인 이메일입니다.';
            case 'auth/password-does-not-meet-requirements':
                return '비밀번호는 6~32자의 영문/숫자/특수문자의 조합이어야 합니다.';
            case 'auth/weak-password':
                return '비밀번호는 최소 6자 이상이어야 합니다.';

            // 로그인 관련
            case 'auth/user-disabled':
                return '비활성화된 계정입니다. 관리자에게 문의해주세요.';
            case 'auth/invalid-credential':
                return '이메일 또는 비밀번호를 확인해주세요.';
            case 'auth/invalid-login-credentials':
                return '로그인 정보가 올바르지 않습니다.';
            case 'auth/user-not-found':
                return '존재하지 않는 계정입니다.';
            case 'auth/wrong-password':
                return '비밀번호가 올바르지 않습니다.';

            // 보안 관련
            case 'auth/too-many-requests':
                return '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
            case 'auth/user-token-expired':
                return '인증이 만료되었습니다. 다시 로그인해주세요.';
            case 'auth/invalid-user-token':
                return '유효하지 않은 인증 정보입니다. 다시 로그인해주세요.';
            case 'auth/requires-recent-login':
                return '보안을 위해 다시 로그인이 필요합니다.';

            // 기타
            case 'auth/network-request-failed':
                return '네트워크 연결을 확인해주세요.';

            default:
                console.error('Unhandled auth error:', errorCode, error.message);
                return '인증 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
    }
}

export default new AuthService();